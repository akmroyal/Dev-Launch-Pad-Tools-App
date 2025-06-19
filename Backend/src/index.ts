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
const roomData = new Map();
const gameRooms: {
  [roomId: string]: {
    players: string[];
    ships: Record<string, any>; // playerId -> ships[]
    ready: Set<string>;
  };
} = {};


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
  socket.on("join_game_room", ({ roomId }) => {
    socket.join(roomId);
    const players = roomData.get(roomId) || [];

    if (players.length < 2) {
      players.push(socket.id);
      roomData.set(roomId, players);
    }

    const opponent: string | undefined = players.find((id: string) => id !== socket.id);
    if (opponent) {
      io.to(opponent).emit("opponent_joined", { name: "Opponent" });
      io.to(socket.id).emit("opponent_joined", { name: "Opponent" });
    }

    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("player_ready", ({ roomId, ships }) => {
    socket.to(roomId).emit("opponent_ready");

    // Optional: Store ships to start game when both ready
    socket.data.ships = ships;

    const room = roomData.get(roomId);
    if (
      room &&
      room.every((id: string) => io.sockets.sockets.get(id)?.data.ships)
    ) {
      const [p1, p2] = room as [string, string];
      const p1Ships: any[] = io.sockets.sockets.get(p1)?.data.ships || [];
      const p2Ships: any[] = io.sockets.sockets.get(p2)?.data.ships || [];

      io.to(p1).emit("start_battle", { opponentShips: p2Ships });
      io.to(p2).emit("start_battle", { opponentShips: p1Ships });
    }
  });

  socket.on("send_guess", ({ roomId, coordinate }) => {
    socket.to(roomId).emit("receive_guess", { coordinate });
  });

  socket.on("send_result", ({ roomId, result }) => {
    socket.to(roomId).emit("receive_result", result);
  });

  socket.on("game_over", ({ roomId, winner }) => {
    io.to(roomId).emit("game_over", { winner });
  });

  // Chat Messaging
  // socket.on("send_message", ({ roomId, message }) => {
  //   socket.to(roomId).emit("receive_message", message);
  // });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (const [roomId, players] of roomData) {
      if (players.includes(socket.id)) {
        const updated: string[] = players.filter((id: string) => id !== socket.id);
        roomData.set(roomId, updated);
        socket.to(roomId).emit("user_left", { username: "Opponent" });
        if (updated.length === 0) roomData.delete(roomId);
      }
    }
  });

});

server.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});
