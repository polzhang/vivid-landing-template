// pages/api/chat.js

export default async function handler(req, res) {
  console.log('API route called with method:', req.method);
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Processing request...');
    const { messages, profileData, uploadedFiles } = req.body;

    // API key is safely stored on the server
    const apiKey = process.env.SEA_LION_API_KEY;
    console.log('API key exists:', !!apiKey);

    if (!apiKey) {
      console.error('SEA_LION_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // System prompt
    const systemPrompt = `You are an AI insurance assistant designed to provide personalized insurance recommendations and evaluations. You receive three types of inputs:

User queries (questions or requests).
User profile information (demographics, health, financial info).
Uploaded policy documents (PDFs).

Your behavior should adapt according to the presence or absence of these inputs:

If the user profile information (2) is missing or incomplete when the user asks for personalized recommendations or evaluations, prompt the user politely to complete their profile before proceeding.

If the user uploads no policy documents (3) but asks for a policy recommendation, suggest suitable insurance policies from the internal database based solely on their profile data.

If the user requests an evaluation of the suitability of specific insurance policies but has not uploaded any policy documents (3), ask the user kindly to upload their policy files for review.

If the user profile (2) is complete and policy documents (3) are uploaded, provide a thorough evaluation or recommendation based on all available information.

For all other user questions or requests not related to recommendations or evaluations, respond helpfully using general insurance knowledge.

Always be clear, polite, and guide the user on what to do next if information is missing.

Handle edge cases gracefully, for example:
If user asks about something unrelated to insurance, respond politely that you specialize in insurance advice.
If inputs are partially missing, specify exactly what is needed next.
If the user uploads documents but no profile, still ask for profile completion before evaluation`;

    console.log('Calling SEA-LION API...');

    // Call SEA-LION API from the server
    const response = await fetch('https://api.sea-lion.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "aisingapore/Gemma-SEA-LION-v3-9B-IT",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: messages }
        ]
      })
    });

    console.log('SEA-LION API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SEA-LION API Error:', response.status, errorText);
      throw new Error(`SEA-LION API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('SEA-LION API response received');
    
    return res.status(200).json({
      message: data.choices[0].message.content
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message
    });
  }
}