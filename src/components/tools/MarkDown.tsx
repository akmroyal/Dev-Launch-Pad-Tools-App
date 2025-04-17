// File: MarkdownEditor.tsx
import { useState } from "react";
import { marked } from "marked";

export default function MarkDown() {
  const [markdown, setMarkdown] = useState<string>("# Hello, *DevLaunchPad* 💻");

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    alert("Copied to clipboard 💖");
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="text-gray-300 bg-gray-800 p-6 rounded-xl shadow-lg mt-18">
      <div className="flex w-full text-gray-400 text-2xl justify-around my-4">
        <h1 className="w-[40%] font-bold">Plaintext : </h1>
        <h1 className="w-[40%] font-bold">Markdown : </h1>
      </div>
      {/* Editor and Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
        <textarea
          className="w-full h-[60vh] p-4 rounded-lg bg-gray-300 focus:outline-none resize-none"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="# Start writing markdown here..."
        />

        <div
          className="w-full h-[60vh] p-4 rounded-lg overflow-auto bg-gray-300"
          dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-6 justify-end">
        <button
          onClick={handleCopy}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-white transition cursor-pointer"
        >
          📋 Copy Markdown
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition cursor-pointer"
        >
          📥 Export .md
        </button>
      </div>
    </section>
  );
}
