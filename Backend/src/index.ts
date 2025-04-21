// index.ts
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // 👈 change if your frontend runs elsewhere
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello from socket backend 🚀");
});

const createdRooms = new Set<string>();

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
  socket.on(
    "check_room",
    (roomId: string, callback: (response: { exist: boolean }) => void) => {
      const exist = createdRooms.has(roomId);
      console.log("🔍 Checking room:", roomId, "=>", exist);
      callback({ exist });
    }
  );

  const emitUserCount = (roomId: string) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const count = room ? room.size : 0;
    io.to(roomId).emit("room_user_count", { count });
  };

  socket.on("join_room", ({ roomId, username }) => {
    if (!roomId || !username) return;
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);
    socket.to(roomId).emit("user_joined", { username });
    emitUserCount(roomId);
  });

  socket.on("send_message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive_message", message);
  });

  socket.on("leave_room", ({ roomId, username }) => {
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
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});
