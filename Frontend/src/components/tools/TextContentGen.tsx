// https://fakerapi.it/api/v1/texts?_locale=en&_quantity=1&_characters=300
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCcw } from "lucide-react";

export default function DummyTextGenerator() {
    const [text, setText] = useState<string>("Add Some : values Here !!");
    const [loading, setLoading] = useState(false);
    const [charLimit, setCharLimit] = useState<number>();
    const [paraCount, setParaCount] = useState<number>();

    const fetchText = async () => {
        // setLoading(true);
        try {
            if (charLimit === undefined && paraCount === undefined) {
                setLoading(false);
                return;
            }
            const response = await fetch(
                `https://fakerapi.it/api/v1/texts?_locale=en&_quantity=${paraCount || 1}&_characters=${charLimit || 10}`
            );
            const data = await response.json();
            setText(data.data.map((d: { content: string }) => d.content).join("\n\n\n"));
        } catch (err) {
            setText("Failed to load dummy text. Please try again. \n" + err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchText();
    }, []);

    const clearAll = () => {
        setText("");
        setCharLimit(0);
        setParaCount(0);
    }

    const copyText = () => {
        if (charLimit !== undefined && paraCount !== undefined) {
            navigator.clipboard.writeText(text);
            alert("Copied Successfully !! 🚀")
        }
    }
    return (
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 flex flex-col items-center justify-start mt-6">

            <Card className="w-full max-w-3xl bg-slate-700/50 backdrop-blur-sm border border-slate-600">
                <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 text-gray-200">
                        <Input
                            type="number"
                            min={1}
                            max={5}
                            value={paraCount}
                            onChange={(e) => setParaCount(parseInt(e.target.value))}
                            placeholder="Paragraphs"
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            min={50}
                            max={1000}
                            value={charLimit}
                            onChange={(e) => setCharLimit(parseInt(e.target.value))}
                            placeholder="Characters"
                            className="flex-1"
                        />
                        <Button onClick={fetchText} variant="secondary" disabled={loading} className="cursor-pointer">
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Generating...
                                </>
                            ) : (
                                <>
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Generate
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="w-full bg-slate-800 text-sm rounded-lg p-4 h-[300px] overflow-auto border border-slate-600">
                        {text.split("\n").map((p, i) => (
                            <p key={i} className="mb-2 leading-relaxed text-gray-200">
                                {p}
                            </p>
                        ))}
                    </div>
                </CardContent>
                <div className="w-full flex justify-center items-center gap-6">
                    <button className="text-xl font-bold px-5 py-2 outline-1 rounded-2xl outline-gray-300 bg-blue-500 text-gray-900 hover:bg-blue-600 focus:bg-blue-600 cursor-pointer" onClick={copyText}>Copy</button>
                    <button className="text-xl font-bold px-5 py-2 outline-1 rounded-2xl outline-gray-300 bg-red-500 text-gray-900 hover:bg-red-600 focus:bg-red-600 cursor-pointer" onClick={clearAll}>Clear</button>
                </div>
            </Card>
        </section>
    );
}
