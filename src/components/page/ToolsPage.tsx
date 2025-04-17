import { useParams } from "react-router"
import DemoTools from "../tools/DemoTools";
import JsonFormatter from "../tools/JsonFormatter";
import ColorPicker from "../tools/ColorPicker";
import TextContentGen from "../tools/TextContentGen";
import Markdown from "../tools/MarkDown";
import UrlEncoder from "../tools/UrlEncoder";

export default function ToolsPage() {
    const { id } = useParams();
    const toolsData = [
        { id: "json-formatter", title: "JSON Formatter", description: "Beautify JSON data", element: <JsonFormatter /> },
        { id: "color-picker", title: "Color Picker", description: "Pick and copy color codes", element: <ColorPicker /> },
        { id: "markdown-previewer", title: "Markdown Previewer", description: "Live markdown to Text", element: <Markdown /> },
        { id: "regex-tester", title: "Regex Tester", description: "Test regular expressions", element: <DemoTools /> },
        { id: "url-encoder", title: "URL Encoder", description: "Encode or decode URLs", element: <UrlEncoder /> },
        { id: "text-generate", title: "📝 Dummy Text Generater", description: "Generate dummy text", element: <TextContentGen /> },
        { id: "unit-convertor", title: "Unit Converter", description: "Convert units easily", element: <DemoTools /> },
        { id: "timestamp-convertor", title: "Timestamp Converter", description: "Epoch ↔ Human Date", element: <DemoTools /> },
        { id: "case-convertor", title: "Case Converter", description: "Change text case easily", element: <DemoTools /> },
    ];

    const tool = toolsData.find(tool => tool.id === id);
    if (!tool) {
        return <div className="text-white min-h-[80vh]">Tool not found</div>;
    }
    return (
        <div className="text-white min-h-[80vh] flex flex-col justify-around">
            <div className="text-center flex flex-col gap-8 mt-18">
                <h1 className="text-5xl font-bold">{tool.title}</h1>
                <h2 className="text-2xl font-semibold mt-2">{tool.description}</h2>
            </div>
            {tool.element}
        </div>
    )
}