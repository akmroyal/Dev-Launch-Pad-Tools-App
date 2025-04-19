import type React from "react"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router"
// import { useRouter } from "next/navigation"

export default function CreateRoomModal({ children }: { children: React.ReactNode }) {
    const [roomId, setRoomId] = useState("")
    const [playerName, setPlayerName] = useState("")
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(false)
    // const { toast } = useToast()
    const navigate = useNavigate();

    const generateRoomId = () => {
        // Generate a random 6-character alphanumeric room ID
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let result = ""
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        setRoomId(result)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId)
        setCopied(true)
        // toast({
        //     title: "Room ID copied!",
        //     description: "Share this with your opponent to start the battle.",
        // })
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCreateRoom = () => {
        if (!playerName.trim()) {
            // toast({
            //     title: "Name required",
            //     description: "Please enter your name to create a room.",
            //     variant: "destructive",
            // })
            return
        }

        // Store created room in localStorage
        const storedRooms = localStorage.getItem("createdRooms")
        const rooms = storedRooms ? JSON.parse(storedRooms) : []
        localStorage.setItem("createdRooms", JSON.stringify([...rooms, roomId]))

        // Store player name
        localStorage.setItem(`player_${roomId}`, playerName)

        // Navigate to game room
        // navigate(`/games/${roomId}`)
        navigate(`/games/battleship/${roomId}`)

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    onClick={() => {
                        generateRoomId()
                    }}
                >
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gray-950 border-gray-700 text-gray-100 animate-slide-up">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-yellow-300">Create Battle Room</DialogTitle>
                    <DialogDescription className="text-gray-200">
                        Generate a unique room ID and share it with your rival to start the battle.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="roomId" className="text-gray-100">
                            Room ID
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input id="roomId" value={roomId} readOnly className="bg-gray-900/50 border-gray-700 text-gray-100" />
                            <Button
                                size="icon"
                                className="border-gray-700 hover:bg-gray-800 hover:text-yellow-300 transition-all duration-300 cursor-pointer"
                                onClick={copyToClipboard}
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="playerName" className="text-gray-100">
                            Your Name
                        </Label>
                        <Input
                            id="playerName"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                            className="bg-gray-900/50 border-gray-700 text-white"
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button
                        className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100 cursor-pointer"
                        onClick={() => generateRoomId()}
                    >
                        Generate New ID
                    </Button>
                    <Button
                        className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold transition-all duration-300 cursor-pointer"
                        onClick={handleCreateRoom}
                    >
                        Create & Join Room
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
