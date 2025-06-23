import io from "socket.io-client";
import { getSocketUrl } from "@/lib/index";

// Global Socket instance of Client side : 
const socket = io(getSocketUrl(), {
    // withCredentials: true,
    transports: ['websocket'],
    autoConnect: false,
})

export default socket;



// import { io, Socket } from 'socket.io-client'

// type SocketEventCallbacks = {
//     onRoomUpdate?: (data: any) => void
//     onOpponentJoined?: (opponentName: string) => void
//     onGameStart?: () => void
//     onMessage?: (message: any) => void
//     onOpponentMove?: (move: any) => void
//     onGameOver?: (winner: string) => void
// }

// let socket: Socket | null = null

// export const initializeSocket = (roomId: string, playerName: string, callbacks: SocketEventCallbacks = {}) => {
//     socket = io('http://localhost:3001', {
//         query: { roomId, playerName },
//         transports: ['websocket']
//     })

//     // Setup event listeners
//     socket.on('connect', () => {
//         console.log('Connected to WebSocket server')
//     })

//     socket.on('roomUpdate', (data) => {
//         callbacks.onRoomUpdate?.(data)
//     })

//     socket.on('opponentJoined', (opponentName) => {
//         callbacks.onOpponentJoined?.(opponentName)
//     })

//     socket.on('gameStart', () => {
//         callbacks.onGameStart?.()
//     })

//     socket.on('newMessage', (message) => {
//         callbacks.onMessage?.(message)
//     })

//     socket.on('opponentMove', (move) => {
//         callbacks.onOpponentMove?.(move)
//     })

//     socket.on('gameOver', (winner) => {
//         callbacks.onGameOver?.(winner)
//     })

//     return socket
// }

// export const getSocket = () => {
//     if (!socket) throw new Error('Socket not initialized')
//     return socket
// }

// // Game action functions
// export const socketActions = {
//     joinRoom: (roomId: string, playerName: string) => {
//         getSocket().emit('joinRoom', { roomId, playerName })
//     },
//     readyToPlay: (roomId: string, ships: any[]) => {
//         getSocket().emit('playerReady', { roomId, ships })
//     },
//     sendMessage: (roomId: string, message: string) => {
//         getSocket().emit('sendMessage', { roomId, message })
//     },
//     makeMove: (roomId: string, coordinate: string) => {
//         getSocket().emit('makeMove', { roomId, coordinate })
//     },
//     requestRematch: (roomId: string) => {
//         getSocket().emit('requestRematch', roomId)
//     }
// }