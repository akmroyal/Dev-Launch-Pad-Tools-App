import aboutimage from "../assets/about.svg";
export default function AboutSection() {
    return (
        <section className="bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] text-white py-16 px-4" id="about">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

                {/* Text Content */}
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-4">👨‍💻 About DevLaunchPad</h2>
                    <p className="text-gray-300 leading-relaxed">
                        DevLaunchPad is your one-stop dev toolkit 🚀 — made for developers, by a developer.
                        Boost your productivity, automate boring stuff, and launch your ideas faster than ever!
                    </p>
                </div>

                {/* SVG Illustration */}
                <div className="flex-1 flex justify-center">
                    <img
                        src={aboutimage}
                        alt="About Illustration"
                        className="max-w-xs md:max-w-md"
                    />
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mt-16">
                <h3 className="text-2xl font-semibold text-blue-400 mb-6">❓ Frequently Asked Questions</h3>
                <div className="space-y-4">
                    {/* FAQ 1 */}
                    <details className="bg-[#2a2a2a] p-4 rounded-lg cursor-pointer">
                        <summary className="font-semibold text-white">Is DevLaunchPad free to use?</summary>
                        <p className="text-gray-400 mt-2">
                            Absolutely! It's 100% free for developers who want to launch tools without hassle.
                        </p>
                    </details>
                    {/* FAQ 2 */}
                    <details className="bg-[#2a2a2a] p-4 rounded-lg cursor-pointer">
                        <summary className="font-semibold text-white">Will more tools be added?</summary>
                        <p className="text-gray-400 mt-2">
                            Yes! We're continuously adding tools and features based on your feedback 🔧
                        </p>
                    </details>
                    {/* FAQ 3 */}
                    <details className="bg-[#2a2a2a] p-4 rounded-lg cursor-pointer">
                        <summary className="font-semibold text-white">Can I contribute?</summary>
                        <p className="text-gray-400 mt-2">
                            Of course, it's open-source! Head over to our GitHub and start contributing ❤️
                        </p>
                    </details>
                </div>
            </div>
        </section>
    )
}