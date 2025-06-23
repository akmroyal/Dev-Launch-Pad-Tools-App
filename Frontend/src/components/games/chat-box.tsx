import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from "../real-time-chat/hooks/useChat"
import { useLocation } from "react-router"

type ChatBoxProps = {
  roomId: string
  playerName: string
  opponentName: string
  disabled?: boolean
}



export default function ChatBox({ roomId, playerName, opponentName, disabled = false }: ChatBoxProps) {

    const [message, setMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const location = useLocation()
    const username = location.state?.username || location.state?.usernameForjoin || playerName || "Anonymous"

    const {
        messages,
        sendMessage,
        isConnected,
        isConnecting,
        error,
        reconnect,
        // userCount,
    } = useChat(roomId, username)

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(message)
            setMessage("")
        }
    }
    console.log(opponentName + " 1 and 2 " +  playerName);
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <div className="flex flex-col h-full">
            {/* <div className="flex-1 overflow-y-auto mb-4 space-y-4">
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
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={disabled ? "Chat unavailable until opponent joins..." : "Type a message..."}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    disabled={disabled}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-950"
                    disabled={disabled}
                    onClick={handleSendMessage}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form> */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
                {messages.length === 0 && !isConnecting ? (
                    <div className="text-center text-gray-400 text-sm mt-6">
                        {isConnected ? "No messages yet. Say hello!" : "Not connected to chat"}
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === username ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.sender === username
                                    ? "bg-yellow-500 text-gray-950"
                                    : msg.sender === "System"
                                        ? "bg-gray-700 text-white/70 italic"
                                        : "bg-gray-800/80 text-white"
                                    } ${msg.isLocal ? "opacity-70" : ""}`}
                            >
                                {msg.sender !== "System" && (
                                    <div className="text-xs font-semibold mb-1">{msg.sender}</div>
                                )}
                                <p className="text-sm">{msg.text}</p>
                                <div className="text-xs text-white/50 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    {msg.isLocal && " · Sending..."}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className="bg-red-600 text-white text-center p-1 text-xs">
                    {error}{" "}
                    {!isConnected && !isConnecting && (
                        <button onClick={reconnect} className="underline ml-2">
                            Reconnect
                        </button>
                    )}
                </div>
            )}

            <div className="flex gap-2 p-2 border-t border-gray-700">
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                        isConnected ? "Type your message..." : isConnecting ? "Connecting..." : "Not connected"
                    }
                    disabled={!isConnected || disabled}
                    className="bg-gray-900/50 border-gray-700 text-white"
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !isConnected || disabled}
                    size="icon"
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-950"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

