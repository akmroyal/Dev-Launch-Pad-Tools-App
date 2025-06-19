import { useEffect } from "react"
import socket from "@/lib/socket"
import { Player, Ship, UseGameSocketProps } from "@/lib/index"

export function useGameSocket({
    roomId,
    onPartnerJoin,
    onOpponentReady,
    onStartBattle,
    onReceiveGuess,
    onReceiveResult,
    onGameOver,
}: UseGameSocketProps) {
    useEffect(() => {
        
        if (!socket.connected) {
            socket.connect()
            socket.once("connect", () => {
                socket.emit("join_game_room", { roomId })
            })
        }


        // socket.emit("join_game_room", { roomId })

        const handleOpponentJoin = ({ name }: { name: string }) => {
            onPartnerJoin(name)
        }

        const handleOpponentReady = () => {
            onOpponentReady()
        }

        const handleStartBattle = ({ opponentShips }: { opponentShips: Ship[] }) => {
            onStartBattle(opponentShips)
        }

        const handleReceiveGuess = ({ coordinate }: { coordinate: string }) => {
            onReceiveGuess(coordinate)
        }

        const handleReceiveResult = ({ coordinate, hit }: { coordinate: string; hit: boolean }) => {
            onReceiveResult({ coordinate, hit })
        }

        const handleGameOver = ({ winner }: { winner: Player }) => {
            onGameOver(winner)
        }

        // Added listeners
        socket.on("opponent_joined", handleOpponentJoin)
        socket.on("opponent_ready", handleOpponentReady)
        socket.on("start_battle", handleStartBattle)
        socket.on("receive_guess", handleReceiveGuess)
        socket.on("receive_result", handleReceiveResult)
        socket.on("game_over", handleGameOver)

        // Clean up for socket listeners
        return () => {
            socket.off("opponent_joined", handleOpponentJoin)
            socket.off("opponent_ready", handleOpponentReady)
            socket.off("start_battle", handleStartBattle)
            socket.off("receive_guess", handleReceiveGuess)
            socket.off("receive_result", handleReceiveResult)
            socket.off("game_over", handleGameOver)

            // socket.disconnect()
        }
    }, [roomId, onPartnerJoin, onOpponentReady, onStartBattle, onReceiveGuess, onReceiveResult, onGameOver])

    return {
        emitReady: (ships: Ship[]) => socket.emit("player_ready", { roomId, ships }),
        sendGuess: (coordinate: string) => socket.emit("send_guess", { roomId, coordinate }),
        sendResult: (result: { coordinate: string; hit: boolean }) => socket.emit("send_result", { roomId, result }),
        sendGameOver: (winner: Player) => socket.emit("game_over", { roomId, winner }),
    }
}
