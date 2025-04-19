import type { Player, GamePhase, Ship, Message } from '@/lib/game-types'

type GamePlayer = {
    id: string
    name: string
    ready: boolean
    ships: Ship[]
}

type GameRoom = {
    id: string
    players: GamePlayer[]
    phase: GamePhase
    currentPlayer: string | null
    messages: Message[]
}

export class GameManager {
    private rooms: Map<string, GameRoom> = new Map()

    addPlayer(roomId: string, socketId: string, playerName: string) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                id: roomId,
                players: [],
                phase: 'waiting',
                currentPlayer: null,
                messages: []
            })
        }

        const room = this.rooms.get(roomId)!
        room.players.push({
            id: socketId,
            name: playerName,
            ready: false,
            ships: []
        })

        if (room.players.length === 2) {
            room.phase = 'preparation'
        }
    }

    setPlayerReady(roomId: string, socketId: string, ships: Ship[]) {
        const room = this.rooms.get(roomId)
        if (!room) return

        const player = room.players.find(p => p.id === socketId)
        if (player) {
            player.ready = true
            player.ships = ships
        }
    }

    processMove(roomId: string, socketId: string, coordinate: string) {
        const room = this.rooms.get(roomId)
        if (!room || room.phase !== 'battle' || room.currentPlayer !== socketId) {
            return { error: 'Invalid move' }
        }

        // Game logic here...
        // Return move result and updated game state
        return { room }
    }

    addChatMessage(roomId: string, message: Omit<Message, 'id' | 'timestamp'>) {
        const room = this.rooms.get(roomId)
        if (!room) throw new Error('Room not found')

        const newMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date()
        }

        room.messages = [...room.messages, newMessage].slice(-70)
        return newMessage
    }

    resetGame(roomId: string) {
        const room = this.rooms.get(roomId)
        if (!room) return

        room.phase = 'preparation'
        room.currentPlayer = null
        room.players.forEach(p => {
            p.ready = false
            p.ships = []
        })
    }

    handleDisconnect(socketId: string) {
        // Clean up disconnected players
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId)
    }
}