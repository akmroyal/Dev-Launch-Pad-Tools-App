import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Message = {
    id: string
    sender: string
    text: string
    timestamp: Date
}

type ChatBoxProps = {
    roomId: string
    playerName: string
    opponentName: string
    disabled?: boolean
}

export default function ChatBox({ roomId, playerName, opponentName, disabled = false }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "system",
            text: disabled
                ? "Chat will be available once your opponent joins the battle."
                : "Welcome to the battle chat! You can communicate with your opponent here.",
            timestamp: new Date(),
        },
    ])
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Scroll to bottom whenever messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Simulate opponent messages in this demo
    // useEffect(() => {
    //     if (disabled || !opponentName) return

    //     const opponentMessages = [
    //         "I'm going to sink all your ships!",
    //         "Where are you hiding your battleship?",
    //         "That was a lucky shot!",
    //         "My fleet is unstoppable!",
    //         "You'll never find my submarine!",
    //     ]

    //     const timer = setTimeout(() => {
    //         const randomMessage = opponentMessages[Math.floor(Math.random() * opponentMessages.length)]
    //         handleOpponentMessage(randomMessage)
    //     }, 5000)

    //     return () => clearTimeout(timer)
    // }, [messages, disabled, opponentName])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || disabled) return

        const message: Message = {
            id: Date.now().toString(),
            sender: "player",
            text: newMessage,
            timestamp: new Date(),
        }

        setMessages([...messages, message])
        setNewMessage("")
    }

    const handleOpponentMessage = (text: string) => {
        const message: Message = {
            id: Date.now().toString(),
            sender: "opponent",
            text,
            timestamp: new Date(),
        }

        setMessages([...messages, message])
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "player" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === "player"
                                    ? "bg-yellow-500 text-gray-950"
                                    : message.sender === "opponent"
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-800/50 text-gray-200 italic"
                                }`}
                        >
                            {message.sender !== "system" && (
                                <div className="text-xs opacity-80 mb-1">{message.sender === "player" ? playerName : opponentName}</div>
                            )}
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={disabled ? "Chat unavailable until opponent joins..." : "Type a message..."}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    disabled={disabled}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-950"
                    disabled={disabled}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}
