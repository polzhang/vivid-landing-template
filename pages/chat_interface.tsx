import { ChatInterface } from "../src/sections/ChatInterface";
import { Footer } from "../src/sections/Footer";
import { Header } from "../src/sections/Header";
// import { Hero } from "../src/sections/Hero";

export default function Chat({
    isDarkMode,
    toggleDarkMode,
}: {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}) {
    return (
        <div className="overflow-hidden col text-strong">
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main>
                <ChatInterface />
            </main>
            <Footer />
        </div>
    );
};

