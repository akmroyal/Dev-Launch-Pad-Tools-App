import { Button } from "@/components/ui/button"
import GameRules from "@/components/games/game-rules"
import CreateRoomModal from "@/components/games/create-room-modal"
import JoinRoomModal from "@/components/games/join-room-modal"

export default function BattleShipsGame() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#373737] to-[#1f1f1f] text-gray-300 my-6 ">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 flex flex-col items-center">
                <div className="text-center mb-12 space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300">
                        ShipBattle Guess
                    </h1>
                    <p className="text-xl md:text-2xl font-semibold text-gray-100">Rule the Waves, Outsmart Your Rival!</p>

                    <div className="max-w-3xl mx-auto mt-8">
                        <p className="text-lg text-gray-200 mb-6">
                            Dive into a strategic sea battle where you and your rival deploy secret fleets on the ocean grid and take
                            turns guessing each other's ship positions. The first to sink all enemy ships –{" "}
                            <span className="font-bold text-yellow-300">WINS!</span>
                        </p>
                    </div>
                </div>

                {/* Game Features */}
                <div className="w-full max-w-4xl mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-yellow-300">🎯 Game Features:</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                emoji: "🛠️",
                                title: "Create Room",
                                description:
                                    "Start a new battle, generate a unique Room ID, and invite your rival to join via the link or code.",
                            },
                            {
                                emoji: "🚪",
                                title: "Join Room",
                                description: "Got a Room ID from your friend? Enter it and dive into battle mode!",
                            },
                            {
                                emoji: "🧠",
                                title: "Game Rules",
                                description: "Tap to read how to place ships, make guesses, earn your strike, and emerge victorious!",
                            },
                            {
                                emoji: "💬",
                                title: "In-Game Chat",
                                description: "Strategize or Sledge! 😈 Message your rival live during the heat of battle.",
                            },
                            {
                                emoji: "🏆",
                                title: "Turn-based Combat",
                                description: "Guess right, keep your streak; miss it, and it's your opponent's turn.",
                            },
                            {
                                emoji: "🎇",
                                title: "Cool FX & Animations",
                                description: "From ship blasts to turn alerts – expect a UI that feels like a real naval battlefield.",
                            },
                        ].map((feature, index) => (
                            <li key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                                <p className="text-gray-100">
                                    <span className="font-bold">
                                        {feature.emoji} {feature.title}:
                                    </span>{" "}
                                    {feature.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Animations Section */}
                <div className="w-full max-w-4xl mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-yellow-300">🚀 Smooth Animations:</h2>
                    <ul className="space-y-2 text-gray-200">
                        <li className="flex items-center gap-2">
                            <span className="text-yellow-400">•</span> Buttons with hover ripple/glow
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-yellow-400">•</span> "Create Room" opens a sleek modal with slide-up animation
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-yellow-400">•</span> Game Rules toggle expands/collapses with smooth accordion
                            effect
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-yellow-400">•</span> Room ID field auto-copies with a subtle tooltip
                        </li>
                    </ul>
                </div>

                {/* Call to Action */}
                <div className="mt-8 space-y-8">
                    <h2 className="text-2xl font-bold text-center text-yellow-300">👾 Ready to Conquer the Waters?</h2>

                    <div className="flex flex-wrap justify-center gap-4">
                        <CreateRoomModal>
                            <Button
                                size="lg"
                                className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] cursor-pointer"
                            >
                                🔥 Create Room
                            </Button>
                        </CreateRoomModal>

                        <JoinRoomModal>
                            <Button
                                size="lg"
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] cursor-pointer"
                            >
                                ⚔️ Join Room
                            </Button>
                        </JoinRoomModal>

                        <GameRules>
                            <Button
                                size="lg"
                                className="bg-gray-900 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 font-bold transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                📜 Read Rules
                            </Button>
                        </GameRules>
                    </div>
                </div>
            </div>
        </main>
    )
}
