// RoomChat.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import io from "socket.io-client";

export default function RoomChat() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const [usernameForjoin, setUsernameForjoin] = useState("");
    const navigate = useNavigate();

    // ✅ Function to check if room exists using temporary socket
    const checkIfRoomExists = (roomId: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const tempSocket = io("http://localhost:3001", {
                forceNew: true,
                reconnection: false,
            });

            tempSocket.on("connect", () => {
                tempSocket.emit("check_room", roomId, (data: { exist: boolean }) => {
                    console.log("🧪 Room exists?", data.exist);
                    resolve(data.exist);
                    tempSocket.disconnect();
                });
            });

            tempSocket.on("connect_error", (err: Error) => {
                console.error("❌ connect_error:", err);
                resolve(false);
            });

            setTimeout(() => {
                console.warn("⚠️ Timeout reached for room check.");
                resolve(false);
            }, 3000);
        });
    };

    // ✅ Create Room
    const handleCreateRoom = async () => {
        if (!username.trim()) {
            alert("Please enter your name.");
            return;
        }

        let newRoomId = Math.random().toString(36).substring(2, 8);
        let exist = await checkIfRoomExists(newRoomId);

        while (exist) {
            newRoomId = Math.random().toString(36).substring(2, 8);
            exist = await checkIfRoomExists(newRoomId);
        }

        const socket = io("http://localhost:3001", {
            forceNew: true,
            reconnection: false,
        });

        socket.on("connect", () => {
            console.log("✅ Connected to socket to create room");
            socket.emit("create_room", newRoomId);
            socket.disconnect();
            navigate(`/games/roomchat/${newRoomId}`, { state: { username } });
        });

        socket.on("connect_error", (err: Error) => {
            console.error("❌ Could not connect to create room:", err);
            alert("Server connection failed.");
        });
    };


    // ✅ Join Room
    const handleJoinRoom = async () => {
        if (!usernameForjoin.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (!roomId.trim()) {
            alert("Please enter room ID.");
            return;
        }

        const exist = await checkIfRoomExists(roomId.trim());
        if (!exist) {
            alert("This room does not exist.");
            return;
        }

        navigate(`/games/roomchat/${roomId}`, { state: { username: usernameForjoin } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    Real-Time Chat
                </h1>

                <div className="space-y-6">
                    {/* Create Room */}
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
                            className="w-full px-4 py-2 rounded-lg border bg-gray-900 border-gray-600 text-white"
                            required
                        />
                        <button
                            onClick={handleCreateRoom}
                            className="w-full mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 cursor-pointer"
                        >
                            Create New Room
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 border-t border-gray-500"></div>
                        <span className="text-gray-400 text-sm">OR</span>
                        <div className="flex-1 border-t border-gray-500"></div>
                    </div>

                    {/* Join Room */}
                    <div>
                        <label htmlFor="usernameForjoin" className="block text-sm font-medium text-gray-300 mb-1">
                            Your Name
                        </label>
                        <input
                            id="usernameForjoin"
                            type="text"
                            value={usernameForjoin}
                            onChange={(e) => setUsernameForjoin(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 rounded-lg border bg-gray-900 border-gray-600 text-white"
                            required
                        />

                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mt-3 mb-1">
                            Join Existing Room
                        </label>
                        <div className="flex space-x-2">
                            <input
                                id="roomId"
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter room ID"
                                className="flex-1 px-4 py-2 rounded-lg border bg-gray-900 border-gray-600 text-white"
                            />
                            <button
                                onClick={handleJoinRoom}
                                disabled={!roomId.trim()}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 cursor-pointer"
                            >
                                Join
                            </button>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-400 mb-2">Chat Guidelines</h2>
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
            </div>
        </div>
    );
}
