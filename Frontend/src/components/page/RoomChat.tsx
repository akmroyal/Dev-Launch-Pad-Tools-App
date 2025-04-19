import { useState } from "react"
import { useNavigate } from "react-router"


export default function RoomChat() {
    const [roomId, setRoomId] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    const handleCreateRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 8)
        navigate(`/games/roomchat/${newRoomId}`, { state: { username } })
    }

    const handleJoinRoom = () => {
        if (!roomId.trim()) return
        navigate(`/games/roomchat/${roomId}`, { state: { username } })
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 bg-clip-text text-gray-200">
                    Real-Time Chat
                </h1>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                            Your Name
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleCreateRoom}
                            className="w-full bg-gray-300 text-gray py-2 px-4 rounded-lg font-medium hover:opacity-80 cursor-pointer transition-opacity shadow-md"
                        >
                            Create New Room
                        </button>

                        <div className="flex items-center space-x-4">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="text-gray-500 text-sm">OR</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        <div>
                            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-1">
                                Join Existing Room
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    id="roomId"
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    placeholder="Enter room ID"
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleJoinRoom}
                                    disabled={!roomId.trim()}
                                    className="bg-accent text-gray-500 py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 cursor-pointer" 
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Chat Guidelines</h2>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Be respectful to other participants</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Keep conversations appropriate</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Messages auto-delete after 100 in a room</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>No persistent storage - chats are temporary</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}