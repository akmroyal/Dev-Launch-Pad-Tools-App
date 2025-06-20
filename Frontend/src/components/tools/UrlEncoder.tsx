import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, RefreshCcw, ShieldCheck, ShieldX } from "lucide-react";
// import { toast } from "sonner";

export default function UrlEncoder() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    const handleTransform = () => {
        try {
            const result =
                mode === "encode"
                    ? encodeURIComponent(input)
                    : decodeURIComponent(input);
            setOutput(result);
        } catch (error) {
            //   toast.error("Decoding failed. Check the input format.");
            console.error("Error decoding:", error);
        }
    };

    const handleCopy = async () => {
        if (output.trim()) {
            await navigator.clipboard.writeText(output);
            // toast.success("Copied to clipboard ✅");
        }
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
    };

    return (
        <section className="min-h-[80vh] bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white flex justify-center items-center mt-18">
            <Card className="w-full max-w-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-xl">
                <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-200">
                            {mode === "encode" ? "🔐 URL Encoder" : "🔓 URL Decoder"}
                        </h1>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMode(mode === "encode" ? "decode" : "encode")}
                            className="text-gray-300 cursor-pointer"
                        >
                            {mode === "encode" ? (
                                <>
                                    <ShieldX className="mr-2 h-4 w-4" />
                                    Switch to Decode
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Switch to Encode
                                </>
                            )}
                        </Button>
                    </div>

                    <Input
                        placeholder={
                            mode === "encode"
                                ? "Enter text to encode"
                                : "Enter URL-encoded text to decode"
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="text-gray-300"
                    />

                    <div className="flex gap-2">
                        <Button onClick={handleTransform} className="cursor-pointer">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            {mode === "encode" ? "Encode" : "Decode"}
                        </Button>
                        <Button variant="destructive" onClick={handleClear} className="cursor-pointer">
                            Clear
                        </Button>
                    </div>

                    <div className="bg-slate-700 text-sm p-4 rounded border border-slate-600 relative">
                        <strong className="block text-white mb-2">Output:</strong>
                        <p className="text-gray-300 break-words whitespace-pre-wrap">
                            {output || "Encoded/Decoded text will appear here..."}
                        </p>
                        {output && (
                            <Button
                                onClick={handleCopy}
                                size="sm"
                                className="absolute top-4 right-4 cursor-pointer"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
