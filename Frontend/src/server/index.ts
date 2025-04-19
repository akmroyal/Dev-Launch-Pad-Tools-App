import { Server } from 'socket.io'
import { GameManager } from './game-manage.tsx'

const PORT = 3001
const io = new Server(PORT, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

const gameManager = new GameManager()

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`)

    socket.on('joinRoom', ({ roomId, playerName }) => {
        gameManager.addPlayer(roomId, socket.id, playerName)
        socket.join(roomId)

        const room = gameManager.getRoom(roomId)
        io.to(roomId).emit('roomUpdate', room)
    })

    socket.on('playerReady', ({ roomId, ships }) => {
        gameManager.setPlayerReady(roomId, socket.id, ships)
        const room = gameManager.getRoom(roomId)
        io.to(roomId).emit('roomUpdate', room)

        if (room.players.every(p => p.ready) && room.players.length === 2) {
            io.to(roomId).emit('gameStart')
        }
    })

    socket.on('makeMove', ({ roomId, coordinate }) => {
        const result = gameManager.processMove(roomId, socket.id, coordinate)
        io.to(roomId).emit('moveResult', result)
    })

    socket.on('sendMessage', ({ roomId, message }) => {
        const chatMessage = gameManager.addChatMessage(roomId, message)
        io.to(roomId).emit('newMessage', chatMessage)
    })

    socket.on('requestRematch', (roomId) => {
        gameManager.resetGame(roomId)
        io.to(roomId).emit('rematchAccepted')
    })

    socket.on('disconnect', () => {
        gameManager.handleDisconnect(socket.id)
    })
})

console.log(`WebSocket server running on port ${PORT}`)