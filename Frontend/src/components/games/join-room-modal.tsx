import type React from "react"

import { useState } from "react"
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
import { useNavigate } from "react-router"

export default function JoinRoomModal({ children }: { children: React.ReactNode }) {
    const [roomId, setRoomId] = useState("")
    const [playerName, setPlayerName] = useState("")
    const [open, setOpen] = useState(false)
    // const router = useRouter()
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (roomId.trim() === "") return

        // In a real app, this would validate the room exists on the server
        navigate(`/games/battleship/${roomId}`)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gray-950 border-gray-700 text-gray-100 animate-slide-up">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-yellow-300">Join Battle Room</DialogTitle>
                    <DialogDescription className="text-gray-200">
                        Enter the room ID shared by your rival to join the battle.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="roomId" className="text-gray-100">
                            Room ID
                        </Label>
                        <Input
                            id="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                            placeholder="Enter 6-character room ID"
                            className="bg-gray-900/50 border-gray-700 text-white"
                            maxLength={6}
                        />
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
                            className="bg-gray-900/50 border-gray-700 text-gray-100"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-bold transition-all duration-300 w-full cursor-pointer"
                        onClick={handleJoinRoom}
                        disabled={!roomId.trim() || !playerName.trim()}
                    >
                        Join Battle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
