import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { GradientText } from '../components/GradientText';
import { Paperclip } from 'lucide-react';
import { info } from 'console';
import { Document } from 'mongodb';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ProfileData {
    age: string;
    dependents: string;
    occupation: string;
    annualIncome: string;
    smokingStatus: string;
    healthConditions: string;
    insuranceType: string;
    involvementLevel: string;
    name: string;
}

interface ChatInterfaceProps {
    profileData?: ProfileData;
    onBack?: () => void;
}

type CustomFileType = {
    file_name: string
    mime_type: string
    size: number
    textContent: string
}

export const ChatInterface = ({ profileData, onBack }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<CustomFileType[]>([]);
    const [ragMode, toggleRagMode] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-generate initial analysis when component mounts with profile data
    useEffect(() => {
        if (profileData && messages.length === 0) {
            generateInitialAnalysis();
        }
    }, [profileData]);

    const generateInitialAnalysis = async () => {
        if (!profileData) return;

        setIsLoading(true);

        try {
            // Build user profile summary
            const profileSummaryLines = [];
            for (const [key, value] of Object.entries(profileData)) {
                if (value && value.toString().trim() !== '') {
                    profileSummaryLines.push(`- ${key}: ${value}`);
                }
            }
            const profileSummary = profileSummaryLines.length > 0
                ? profileSummaryLines.join('\n')
                : "No profile information provided.";

            // Initial analysis request
            const initialRequest = [
                "User Profile Information:",
                profileSummary,
                "",
                "No policy documents uploaded.",
                "",
                "User Query:",
                "Please provide a comprehensive insurance analysis and personalized recommendations based on my profile. Include suitable insurance types, coverage amounts, and explain why these recommendations fit my situation."
            ].join('\n');

            // Call the API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: initialRequest,
                    profileData,
                    uploadedFiles: []
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
            }

            const data = await response.json();

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: data.message,
                timestamp: new Date()
            };

            setMessages([assistantMessage]);

        } catch (error) {
            console.error('Error generating initial analysis:', error);
            let errorMsg = 'Sorry, I encountered an error generating your initial analysis.';

            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    errorMsg = 'Authentication error. Please contact support.';
                } else if (error.message.includes('403')) {
                    errorMsg = 'Access forbidden. Please contact support.';
                } else if (error.message.includes('429')) {
                    errorMsg = 'Too many requests. Please try again in a moment.';
                } else if (error.message.includes('500')) {
                    errorMsg = 'Server error. Please try again later.';
                } else {
                    errorMsg = `Error: ${error.message}`;
                }
            }

            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: errorMsg,
                timestamp: new Date()
            };
            setMessages([errorMessage]);
        } finally {
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    // Corrected file select function to trigger the parent's upload logic
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            if (file.type === 'application/pdf') {
                handleFileUpload(file); // This calls the parent's upload function
            } else {
                alert('Only PDF files are supported.');
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileUpload = async (file: File) => {
        if (!file) return

        setIsLoading(true)

        const formData1 = new FormData()
        formData1.append("file", file)

        try {
            const response1 = await fetch("/api/parse-pdf", {
                method: "POST",
                body: formData1,
            })
            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`)
            }
            const data1 = await response1.json()

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `✅ File "${file.name}" added successfully and its content is now available.`,
                    timestamp: new Date()
                },
            ])
            setUploadedFiles((prev) => [...prev, data1])
            return data1
        } catch (error) {
            console.error("Error parsing PDF file:", error)
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `❌ Error parsing file "${file.name}". Please try again.`,
                    timestamp: new Date()
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const sendMessage = async () => {
        if (!currentMessage.trim()) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: currentMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);

        try {
            // Build user profile summary
            const profileSummaryLines = [];
            if (profileData) {
                for (const [key, value] of Object.entries(profileData)) {
                    if (value && value.toString().trim() !== '') {
                        profileSummaryLines.push(`- ${key}: ${value}`);
                    }
                }
            }
            const profileSummary = profileSummaryLines.length > 0
                ? profileSummaryLines.join('\n')
                : "No profile information provided.";

            // Build files summary
            const filesSummary = uploadedFiles.length > 0
                ? `Uploaded policy documents: ${uploadedFiles.map(f => f.file_name).join(', ')}`
                : "No policy documents uploaded.";

            // Combine all user info
            var combinedUserContent = [
                "User Profile Information:",
                profileSummary,
                "",
                filesSummary,
                "",
                "User Query:",
                currentMessage
            ].join('\n');

            if (ragMode) {
                const hyde_msg = `
                    I am using Hyde. 
                    You are an insurance agent. 

                    These are the relevant documents:
                    ${uploadedFiles.map((file) => file.textContent).join("\n\n")}
                    This is the prompt by the user:
                    ${combinedUserContent}

                    Give me the relevant details as the best embedding to enable RAG to pull the best relevant documents.
                `

                const hyde_resp = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: hyde_msg,
                        profileData,
                        uploadedFiles: uploadedFiles.map(f => f.file_name)
                    })
                });

                const embeddings = await fetch("/api/embedder", {
                    method: "POST",
                    body: JSON.stringify({
                        message: hyde_resp
                    }),
                })
                if (!embeddings.ok) {
                    throw new Error(`HTTP error! status: ${embeddings.status}`)
                }
                const embedding = await embeddings.json()

                const res = await fetch("/api/vector-search", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ embedding }),
                })

                const data = await res.json()
                const topMatches = data.matches

                // After you get topMatches from vector search
                const context = topMatches
                    .map(
                        (doc: Document, i: number) =>
                            `Document ${i + 1} (${doc.fileName}):\n${doc.textContent}`,
                    )
                    .join("\n\n")

                // Create the final prompt for your LLM
                combinedUserContent = `
                    You are a helpful assistant. Use the following context from documents to answer the question accurately.

                    Context:
                    ${context}

                    Relevant user documents:
                    ${uploadedFiles.map((file) => file.textContent).join("\n")}

                    Question:
                    ${combinedUserContent}

                    Answer:
                `

            }

            // Call API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: combinedUserContent,
                    profileData,
                    uploadedFiles: uploadedFiles.map(f => f.file_name)
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
            }

            const data = await response.json();

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: data.message,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Clear uploaded files after successful response (if any exist)
            if (uploadedFiles.length > 0) {
                setUploadedFiles([]);
            }

        } catch (error) {
            console.error('Error calling backend API:', error);
            let errorMsg = 'Sorry, I encountered an error processing your request.';

            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    errorMsg = 'Authentication error. Please contact support.';
                } else if (error.message.includes('403')) {
                    errorMsg = 'Access forbidden. Please contact support.';
                } else if (error.message.includes('429')) {
                    errorMsg = 'Too many requests. Please try again in a moment.';
                } else if (error.message.includes('500')) {
                    errorMsg = 'Server error. Please try again later.';
                } else {
                    errorMsg = `Error: ${error.message}`;
                }
            }

            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: errorMsg,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">

            <div style={{ zIndex: "10" }} className="flex items-center gap-2 mb-4 mt-5">
                <span className="text-xs text-gray-500">RAG Mode</span>
                <button
                    onClick={() => toggleRagMode(!ragMode)}
                    role="switch"
                    aria-checked={ragMode}
                    style={{
                        cursor: "pointer"
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${ragMode
                        ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                        : "bg-gray-300 dark:bg-gray-600"}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${ragMode ? "translate-x-4" : "translate-x-1"}`}
                    />
                </button>
            </div>

            {/* Chat Messages - Maximum space */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-3 bg-gray-50 p-3 rounded-lg">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-4xl px-4 py-3 rounded-lg ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                        >
                            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                                __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            }}></div>
                            <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                                }`}>
                                {message.timestamp.toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                <span>{messages.length === 0 ? 'Generating your personalized analysis...' : 'Analyzing...'}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Minimal Message Input */}
            <div className="flex gap-2 items-end">
                <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about insurance recommendations..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-sm h-12"
                    rows={1}
                    disabled={isLoading}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className={`flex items-center justify-center h-12 w-12 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    <Paperclip className="w-4 h-4" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                // If you want to handle file selection:
                // onChange={(e) => console.log(e.target.files)}
                />
                <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    className="px-4 h-12 flex items-center justify-center"
                >
                    Send
                </Button>
            </div>
        </div>
    );
};
