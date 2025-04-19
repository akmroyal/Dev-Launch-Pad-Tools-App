import { useState } from "react"

export default function JsonFormatter() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [show, setShow] = useState<string>("");

    const handleFormat = () => {
        try {
            const formatted = JSON.stringify(JSON.parse(input), null, 4);
            setOutput(formatted);
        } catch (err) {
            setOutput("❌ : Invalid JSON format \n" + err);
            console.log(err);
        }
    }
    const handleMinify = () => {
        try {
            const minify = JSON.stringify(JSON.parse(input));
            setOutput(minify);
        } catch (err) {
            setOutput("❌ : Invalid JSON format \n" + err);
            console.log(err);
        }
    }

    // Text Copy
    const copyHandle = async () => {
        try {
            await navigator.clipboard.writeText(output);
            if (output === "") {
                setShow("❌ : No Output to Copy")
                return
            }
            setShow("✅ : Copied")
            setTimeout(() => setShow(" "), 2000)            
        } catch (error) {
            setShow("❌ : Copy Failed \n" + error)
        }
    }
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 bg-gray-800 text-white p-6 gap-4 rounded-lg h-[80vh] mt-18">
            {/* Input */}
            <textarea
                className="bg-gray-700 p-4 rounded-lg resize-none font-mono hover:bg-gray-800 hover:text-gray-400 hover:outline-3 hover:outline-gray-100"
                placeholder='{"name": "value"}'
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex flex-col justify-between items-center gap-4 py-10">
                <div className="">
                    {show}
                </div>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleFormat}
                        className="bg-yellow-700 hover:bg-yellow-600 rounded-lg text-xl font-semibold w-32 p-2 cursor-pointer"
                    >
                        Format
                    </button>
                    <button
                        onClick={handleMinify}
                        className="bg-blue-700 hover:bg-blue-600 rounded-lg text-xl font-semibold w-32 p-2 cursor-pointer"
                    >
                        Minify
                    </button>
                </div>
                <div className="flex gap-4">
                    <button className="bg-red-700 hover:bg-red-600 rounded-lg text-xl font-semibold w-32 p-2 cursor-pointer" onClick={() => setInput("")}>Clear</button>
                    <button className="outline-2 rounded-2xl px-6 py-2 cursor-pointer hover:bg-gray-900 hover:outline-gray-100 text-xl font-semibold text-gray-500 hover:text-gray-100" onClick={copyHandle}>Copy</button>
                </div>
            </div>

            {/* Output */}
            <textarea
                readOnly
                className="bg-gray-700 p-4 rounded-lg resize-none font-mono hover:bg-gray-800 hover:text-gray-400 hover:outline-3 hover:outline-gray-100"
                placeholder="{
    Output: 'O/p will appear here'
}"
                value={output}
            />
        </section>
    )
}