import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

// Resources of the game
import shipbattle from "../assets/GameResrc/BattleShip.jpg"
import roomchat from "../assets/chat-app.jpeg"

const games = [
    {
        pagename: "battleship",
        title: "Battle of Water : Survival",
        genre: "Battle Royale",
        description: "This is a water battle game where you have to guess the ships position and just blast them first.",
        platform: "Play Now",
        image: shipbattle,
    },
    {
        pagename: "roomchat",
        title: "Real time room chat : Chat",
        genre: "Room Chat Application",
        description: "This is a room chat application where you can chat with your partner in your space/room.",
        platform: "Chat Now",
        image: roomchat,
    },
    // {
    //     title: "Elden Ring",
    //     genre: "RPG",
    //     platform: "PC, PS5, Xbox",
    //     image:
    //         "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    // },
    // {
    //     title: "PUBG: Battlegrounds",
    //     genre: "Battle Royale",
    //     platform: "PC, Mobile",
    //     image:
    //         "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
    // },
];

const emojis = ["🎮", "🕹️", "⚔️", "👾", "🧠", "🚀", "🧩", "🎲"];


export default function GameGrid() {
    const [emojiIndex, setEmojiIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setEmojiIndex((prev) => (prev + 1) % emojis.length);
        }, 3000); // Change emoji every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2c2c2c] text-white py-10 px-4 sm:px-10">
            <div className="flex flex-col items-center my-6">
                <motion.div
                    key={emojiIndex} // re-trigger animation on emoji change
                    initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1.2, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="text-center text-4xl sm:text-5xl font-bold mb-6 inline-block text-gray-300"
                >
                    {emojis[emojiIndex]} Featured Games
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-slate-800 border border-slate-600 shadow-lg hover:scale-[1.02] transition-all duration-200">
                            <img
                                src={game.image}
                                alt={game.title}
                                className="rounded-t-lg w-full h-40 object-cover"
                            />
                            <CardContent className="p-4">
                                <h3 className="text-2xl font-bold mb-1 text-gray-300">{game.title}</h3>
                                <p className="text-xl text-gray-400 mb-2 ">{game.description}</p>
                                <div className="">
                                    <Badge variant="outline" className="text-md text-gray-400 font-bold">
                                        {game.genre}
                                    </Badge>
                                    <Badge variant="secondary" className="cursor-pointer text-md font-bold text-gray-900 ml-2 hover:bg-gray-600 focus:bg-gray-600 hover:text-gray-300 focus:text-gray-300" onClick={() => navigate(`/games/${game.pagename}`)}>
                                        {game.platform}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}