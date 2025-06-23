import type { Player, GamePhase } from "@/lib/index"

type GameStatusProps = {
    gamePhase: GamePhase
    currentPlayer: Player
    playerName: string
    opponentName: string
    winner: Player | null
    partnerJoined?: boolean
    isPlayerReady?: boolean
    isOpponentReady?: boolean
}

export default function GameStatus({
    gamePhase,
    currentPlayer,
    // playerName,
    opponentName,
    winner,
    partnerJoined = false,
    isPlayerReady = false,
    isOpponentReady = false,
}: GameStatusProps) {
    const getStatusMessage = () => {
        if (gamePhase === "waiting") {
            return "Wainting for an opponent to join... Share your room code!"
        }

        if (gamePhase === "preparation") {
            if (!partnerJoined) {
                return "Waiting for an opponent to join..."
            }

            if (!isPlayerReady && !isOpponentReady) {
                return "Place your ships and click 'Ready' to start the battle"
            }

            if (isPlayerReady && !isOpponentReady) {
                return "Waiting for your opponent to get ready..."
            }

            if (!isPlayerReady && isOpponentReady) {
                return "Your opponent is ready! Place your ships and click 'Ready'"
            }

            return "Both players ready! Starting battle..."
        }

        if (gamePhase === "gameOver") {
            return winner === "player1"
                ? "🎉 Victory! You have defeated your opponent!"
                : "😔 Defeat! Your fleet has been destroyed!"
        }

        return currentPlayer === "player1" ? "🎯 Your turn to fire!" : `⏳ Waiting for ${opponentName} to make a move...`
    }

    const getStatusClass = () => {
        if (gamePhase === "waiting") {
            return "bg-gray-600/20 text-gray-300 border border-gray-600"
        }

        if (gamePhase === "preparation") {
            if (isPlayerReady && isOpponentReady) {
                return "bg-green-600/20 text-green-300 border border-green-600"
            }
            return "bg-gray-600/20 text-gray-300 border border-gray-600"
        }

        if (gamePhase === "gameOver") {
            return winner === "player1"
                ? "bg-green-600/20 text-green-300 border border-green-600"
                : "bg-red-600/20 text-red-300 border border-red-600"
        }

        return currentPlayer === "player1"
            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500"
            : "bg-gray-600/20 text-gray-300 border border-gray-600"
    }

    return <div className={`p-4 rounded-lg text-center text-lg font-bold ${getStatusClass()}`}>{getStatusMessage()}</div>
}
