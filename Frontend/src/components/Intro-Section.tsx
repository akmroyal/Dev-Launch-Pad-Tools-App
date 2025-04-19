export default function IntroSection() {
    return (
        <div className="text-gray-400 flex flex-col items-center gap-26 mt-20">
            <div className="text-center flex flex-col gap-8">
                <p className="text-6xl md:text-7xl font-bold">
                    DevLaunchPad
                    <span className="rocket-fly">🚀</span>
                </p>
                <p className="text-5xl font-semibold italic">"Launch Productivity. Land Efficiency."</p>
                <p className="">From JSON to Markdown — Everything at your fingertips.</p>
            </div>
            <div>
                <button className="bg-gray-600 rounded-3xl py-2 px-4">
                    <a href="#tools" className="text-2xl font-semibold">Explore Now</a>
                </button>
            </div>
        </div>
    )
}