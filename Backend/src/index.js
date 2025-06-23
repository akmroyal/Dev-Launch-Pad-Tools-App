"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.Frontend_URL, // 👈 change if your frontend runs elsewhere
        methods: ["GET", "POST"],
        credentials: true,
    },
});
app.use((0, cors_1.default)());
app.get("/", (_req, res) => {
    res.send("Hello from socket backend 🚀");
});
const createdRooms = new Set();
const roomData = new Map();
const gameRooms = {};
io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);
    // 📌 Room Creation Handler
    socket.on("create_room", (roomId) => {
        if (roomId) {
            createdRooms.add(roomId);
            console.log("Room Created:", roomId);
        }
    });
    // 📌 Check Room Existence Handler
    socket.on("check_room", (roomId, callback) => {
        const exist = createdRooms.has(roomId);
        console.log("🔍 Checking room:", roomId, "=>", exist);
        callback({ exist });
    });
    const emitUserCount = (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        const count = room ? room.size : 0;
        io.to(roomId).emit("room_user_count", { count });
    };
    socket.on("join_room", (data) => {
        const { roomId, username } = data;
        if (!roomId || !username)
            return;
        socket.join(roomId);
        console.log(`${username} joined room: ${roomId}`);
        socket.to(roomId).emit("user_joined", { username });
        emitUserCount(roomId);
    });
    socket.on("send_message", (data) => {
        const { roomId, message } = data;
        socket.to(roomId).emit("receive_message", message);
    });
    socket.on("leave_room", (data) => {
        const { roomId, username } = data;
        socket.leave(roomId);
        socket.to(roomId).emit("user_left", { username });
        emitUserCount(roomId);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((roomId) => {
            setTimeout(() => {
                const room = io.sockets.adapter.rooms.get(roomId);
                if (!room || room.size === 0) {
                    createdRooms.delete(roomId);
                    console.log("Room removed:", roomId);
                }
            }, 100);
        });
        socket.rooms.forEach((roomId) => {
            const room = gameRooms[roomId];
            if (room) {
                room.players = room.players.filter((id) => id !== socket.id);
                room.ready.delete(socket.id);
                delete room.ships[socket.id];
                if (room.players.length === 0) {
                    delete gameRooms[roomId];
                    createdRooms.delete(roomId);
                }
            }
        });
    });
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
    // Game-related events
    socket.on("join_game_room", (data) => {
        const { roomId } = data;
        socket.join(roomId);
        const players = roomData.get(roomId) || [];
        if (players.length < 2) {
            players.push(socket.id);
            roomData.set(roomId, players);
        }
        const opponent = players.find((id) => id !== socket.id);
        if (opponent) {
            io.to(opponent).emit("opponent_joined", { name: "Opponent" });
            io.to(socket.id).emit("opponent_joined", { name: "Opponent" });
        }
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });
    socket.on("player_ready", (data) => {
        var _a, _b;
        const { roomId, ships } = data;
        socket.to(roomId).emit("opponent_ready");
        // Optional: Store ships to start game when both ready
        socket.data.ships = ships;
        const room = roomData.get(roomId);
        if (room &&
            room.every((id) => { var _a; return (_a = io.sockets.sockets.get(id)) === null || _a === void 0 ? void 0 : _a.data.ships; })) {
            const [p1, p2] = room;
            const p1Ships = ((_a = io.sockets.sockets.get(p1)) === null || _a === void 0 ? void 0 : _a.data.ships) || [];
            const p2Ships = ((_b = io.sockets.sockets.get(p2)) === null || _b === void 0 ? void 0 : _b.data.ships) || [];
            io.to(p1).emit("start_battle", { opponentShips: p2Ships });
            io.to(p2).emit("start_battle", { opponentShips: p1Ships });
        }
    });
    socket.on("send_guess", (data) => {
        const { roomId, coordinate } = data;
        socket.to(roomId).emit("receive_guess", { coordinate });
    });
    socket.on("send_result", (data) => {
        const { roomId, result } = data;
        socket.to(roomId).emit("receive_result", result);
    });
    socket.on("game_over", (data) => {
        const { roomId, winner } = data;
        io.to(roomId).emit("game_over", { winner });
    });
    // Chat Messaging
    // socket.on("send_message", (data: SendMessageData) => {
    //   const { roomId, message } = data;
    //   socket.to(roomId).emit("receive_message", message);
    // });
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
        for (const [roomId, players] of roomData) {
            if (players.includes(socket.id)) {
                const updated = players.filter((id) => id !== socket.id);
                roomData.set(roomId, updated);
                socket.to(roomId).emit("user_left", { username: "Opponent" });
                if (updated.length === 0)
                    roomData.delete(roomId);
            }
        }
    });
});
server.listen(process.env.PORT, () => {
    console.log("🚀 Server running on " + process.env.PORT);
});
