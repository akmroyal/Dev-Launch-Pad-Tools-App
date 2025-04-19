import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"

type WaitingRoomProps = {
    roomId: string
    onPartnerJoin: () => void
}

export default function WaitingRoom({ roomId, onPartnerJoin }: WaitingRoomProps) {
    const [copied, setCopied] = useState(false)
    // const { toast } = useToast()

    // Store created room in localStorage
    useEffect(() => {
        const storedRooms = localStorage.getItem("createdRooms")
        const rooms = storedRooms ? JSON.parse(storedRooms) : []

        if (!rooms.includes(roomId)) {
            localStorage.setItem("createdRooms", JSON.stringify([...rooms, roomId]))
        }
    }, [roomId])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId)
        setCopied(true)
        // toast({
        //     title: "Room ID copied!",
        //     description: "Share this with your opponent to start the battle.",
        // })
        setTimeout(() => setCopied(false), 2000)
    }

    // For demo purposes, simulate a partner joining after some time
    useEffect(() => {
        const timer = setTimeout(() => {
            // This would be triggered by a WebSocket event in a real app
            onPartnerJoin()
        }, 10000)

        return () => clearTimeout(timer)
    }, [onPartnerJoin])

    return (
        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 text-center">
            <h2 className="text-2xl font-bold mb-6 text-yellow-300">Waiting for Opponent</h2>

            <div className="max-w-md mx-auto">
                <p className="text-gray-200 mb-8">
                    Share this room code with your friend to start the battle. You can adjust your ships while waiting.
                </p>

                <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-300 mb-2">Room Code:</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="text-2xl font-mono text-white tracking-wider">{roomId}</div>
                        <Button
                            size="icon"
                            variant="outline"
                            className="border-gray-700 hover:bg-gray-800 hover:text-yellow-300 transition-all duration-300"
                            onClick={copyToClipboard}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="animate-pulse">
                    <p className="text-gray-300">Waiting for opponent to join...</p>
                </div>
            </div>
        </div>
    )
}
