"use client";
import { useRef, useState, useEffect } from "react";

export default function ColorPicker() {
    const [image, setImage] = useState<string | null>(null);
    const [pickedColor, setPickedColor] = useState<string>("");
    const [rgbColor, setRgbColor] = useState<string>("");
    const imageRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [msgShow, setMsgShow] = useState<string>("");
    // let color = "";
    const [color, setColor] = useState<string>("");
    const [switcher, setSwitcher] = useState<boolean>(false);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bounds = imageRef.current.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

        const realX = Math.floor(x * scaleX);
        const realY = Math.floor(y * scaleY);

        const pixel = ctx.getImageData(realX, realY, 1, 1).data;
        const [r, g, b] = pixel;
        setPickedColor(`#${r.toString(16)}${g.toString(16)}${b.toString(16)}`);
        setRgbColor(`rgb(${r}, ${g}, ${b})`);
    };

    useEffect(() => {
        if (!image || !canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = imageRef.current;

        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx?.drawImage(img, 0, 0);
        };
    }, [image]);

    const copyToClipboard = () => {
        if (pickedColor) {
            navigator.clipboard.writeText(pickedColor);
            setColor("text-green-500");
            setMsgShow("Color copied! 🎨");
            setTimeout(() => {
                setMsgShow("");
            }, 2000);
        }
    };
    const resetColor = () => {
        if (image || pickedColor || rgbColor) {
            setMsgShow("Reset! 🔁");
            setColor("text-red-500")
            setTimeout(() => {
                setMsgShow("");
            }, 4000);
            setImage(null);
            setPickedColor("");
            setRgbColor("");
        }
    }
    const handleColorSwitcher = () => {
        setSwitcher(false);
        console.log(switcher);

    }
    const handleImageSwitcher = () => {
        setSwitcher(true);
        console.log(switcher);

    }
    return (
        <section className="bg-gray-900 text-white rounded-2xl min-h-[80vh] p-6 flex flex-col md:flex-row gap-6">
            {/* Left Side: Conditional Render based on switcher */}
            {switcher ? (
                // 🖼 Image Picker Mode
                <div className="md:w-1/2 w-full bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <h1 className="mb-6 text-2xl font-semibold">Pick Color from Image</h1>
                    {!image ? (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full h-16 text-sm bg-gray-700 rounded p-2 cursor-pointer "
                        />
                    ) : (
                        <div className="relative w-full">
                            <img
                                src={image}
                                ref={imageRef}
                                onClick={handleImageClick}
                                className="rounded-lg w-full max-h-[400px] object-contain cursor-crosshair"
                                alt="Uploaded Preview"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    )}
                </div>
            ) : (
                // 🎨 Manual Color Picker Mode
                <div className="md:w-1/2 w-full bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center gap-4">
                    <label htmlFor="colorPicker" className="text-lg font-semibold">Choose a color</label>
                    <input
                        type="color"
                        id="colorPicker"
                        className="w-full h-32 rounded-xl cursor-pointer border-white"
                        onChange={(e) => {
                            const selectedColor = e.target.value;
                            setPickedColor(selectedColor);
                            // Convert hex to RGB
                            const r = parseInt(selectedColor.slice(1, 3), 16);
                            const g = parseInt(selectedColor.slice(3, 5), 16);
                            const b = parseInt(selectedColor.slice(5, 7), 16);
                            setRgbColor(`rgb(${r}, ${g}, ${b})`);
                        }}
                    />
                </div>
            )}

            {/* Mode Switch Buttons */}
            <div className="flex md:w-40 md:flex-col gap-2 md:gap-6 justify-center items-center">
                <button className="outline-2 outline-gray-400 rounded-2xl p-2 cursor-pointer hover:bg-gray-600 font-semibold" onClick={handleColorSwitcher}>Pick Color</button>
                <button className="outline-2 outline-gray-400 rounded-2xl p-2 cursor-pointer hover:bg-gray-600 font-semibold" onClick={handleImageSwitcher}>Image Picker</button>
            </div>

            {/* Right Side: Preview and Actions */}
            <div className="md:w-1/2 w-full bg-gray-800 p-6 rounded-xl flex flex-col gap-4 justify-center items-start">
                <div className="w-full text-center">
                    <span className={`${color}`}>{msgShow}</span>
                </div>
                <h2 className="text-2xl font-bold">Picked Color</h2>
                <div
                    className="w-full h-20 rounded-xl border-2 border-white"
                    style={{ backgroundColor: pickedColor || "#000000" }}
                />
                <p>
                    <span className="font-semibold">HEX:</span> {pickedColor || "N/A"}
                </p>
                <p>
                    <span className="font-semibold">RGB:</span> {rgbColor || "N/A"}
                </p>
                <div className="flex w-full px-4 gap-4">
                    <button
                        className="mt-2 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 transition cursor-pointer"
                        onClick={copyToClipboard}
                    >
                        Copy to Clipboard
                    </button>
                    <button
                        className="mt-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition cursor-pointer"
                        onClick={resetColor}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </section>
    );
}
