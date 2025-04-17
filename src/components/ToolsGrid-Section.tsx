import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Tool = {
    id: string;
    title: string;
    description: string;
    isFrequent: boolean;
}

const toolsData: Tool[] = [
    { id: "json-formatter", title: "JSON Formatter", description: "Beautify JSON data", isFrequent: true },
    { id: "color-picker", title: "Color Picker", description: "Pick and copy color codes", isFrequent: true },
    { id: "markdown-previewer", title: "Markdown Previewer", description: "Live markdown to HTML", isFrequent: true },
    { id: "text-generate", title: "Text Generator", description: "Generate dummy text", isFrequent: false },
    // { id: "regex-tester", title: "Regex Tester", description: "Test regular expressions", isFrequent: false },
    { id: "url-encoder", title: "URL Encoder", description: "Encode or decode URLs", isFrequent: false },
    // { id: "unit-convertor", title: "Unit Converter", description: "Convert units easily", isFrequent: false },
    // { id: "timestamp-convertor", title: "Timestamp Converter", description: "Epoch ↔ Human Date", isFrequent: false },
    // { id: "case-convertor", title: "Case Converter", description: "Change text case easily", isFrequent: false },
];

export default function ToolsGridSection() {
    // using for navigate to desire page
    const navigate = useNavigate();

    const [showAll, setShowAll] = useState(false);

    // Sorting to 3 tools on frequent basis 
    const sortedTools = [...toolsData].sort((a, b) => {
        return ((b.isFrequent ? 1 : 0) - (a.isFrequent ? 1 : 0));
    })

    // now I'll print tools 6 or all on the showAll (true/false) basis
    const isVisible = showAll ? sortedTools : sortedTools.slice(0, 6);

    // apply emoji changing effect :
    const emojis = ["😁", "🤑", "🤠", "☺️", "😏", "😶‍🌫️", "🥵", "🤩", "🤪", "😵", "😵‍💫", "🥳", "🤧"];
    const [emoji, setEmoji] = useState(emojis[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const random = Math.floor(Math.random() * emojis.length);
            setEmoji(emojis[random]);
        }, 1000);

        return () => clearInterval(interval);
    });


    return (
        <section className="flex flex-col items-center px-4 py-12" id="tools">
            <h1 className="text-4xl text-center font-bold text-white mb-8" >Explore the Tools : <span>{emoji}</span></h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                {isVisible.map((tool) => (
                    <div
                        key={tool.id}
                        className="bg-gray-600 rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer hover:bg-gray-700"
                        onClick={() => navigate(`/tool/${tool.id}`)}
                    >
                        <h2 className="text-2xl font-semibold mb-2 text-gray-200">{tool.title}</h2>
                        <p className="text-md text-gray-400">{tool.description}</p>
                    </div>
                ))}
            </div>
            {sortedTools.length > 6 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-gray-300 hover:text-white bg-[#2a2a2a] px-5 py-2 rounded-full transition cursor-pointer"
                    >
                        {showAll ? "Show Less ▲" : "Show More ▼"}
                    </button>
                </div>
            )}

        </section>
    )
}