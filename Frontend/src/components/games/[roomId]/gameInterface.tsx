import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GameBoard from "@/components/games/game-board"
import ChatBox from "@/components/games/chat-box"
import GameStatus from "@/components/games/game-status"
import WaitingRoom from "@/components/games/waiting-room"
import ReadyButton from "@/components/games/ready-button"
import Notification from "@/components/games/notification"
import type { Ship, Player, GamePhase } from "@/lib/index"
import { useLocation, useNavigate, useParams } from "react-router"
import { useGameSocket } from "../hooks/useGameSocket"

export default function GameRoom() {
    const params = useParams()
    const navigate = useNavigate()
    const roomId = params.roomId as string
    const location = useLocation();
    // const username = location.state?.username || "Creator";

    const [gamePhase, setGamePhase] = useState<GamePhase>("waiting")
    const [currentPlayer, setCurrentPlayer] = useState<Player>("player1")
    const [player1Ships, setPlayer1Ships] = useState<Ship[]>([])
    const [player2Ships, setPlayer2Ships] = useState<Ship[]>([])
    const [player1Hits, setPlayer1Hits] = useState<string[]>([])
    const [player2Hits, setPlayer2Hits] = useState<string[]>([])
    const [player1Misses, setPlayer1Misses] = useState<string[]>([])
    const [player2Misses, setPlayer2Misses] = useState<string[]>([])
    const [winner, setWinner] = useState<Player | null>(null)
    const [playerName, setPlayerName] = useState("")
    const [opponentName, setOpponentName] = useState("")
    // const [isCreator, setIsCreator] = useState(true)
    const [partnerJoined, setPartnerJoined] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [isPlayerReady, setIsPlayerReady] = useState(false)
    const [isOpponentReady, setIsOpponentReady] = useState(false)

    // setPlayerName(location.state?.username || "Creator")
    useEffect(() => {
        if (location.state?.username)
            setPlayerName(location.state.username);
        else
            setPlayerName("Creator")
    }, [location.state])
    const {
        emitReady,
        sendGuess,
        sendResult,
        sendGameOver,
    } = useGameSocket({
        roomId,
        onPartnerJoin: (name) => {
            setPartnerJoined(true)
            setOpponentName(name)
            setNotificationMessage(`${name} has joined the battle room!`)
            setShowNotification(true)
            setGamePhase("preparation")
            setTimeout(() => setShowNotification(false), 3000)
        },
        onOpponentReady: () => {
            setIsOpponentReady(true)
            setNotificationMessage("Your Opponent is ready for the Battle !")
            setTimeout(() => {
                setShowNotification(false)
                if (isPlayerReady) {
                    setGamePhase("battle")
                }
            }, 3000)
        },
        onStartBattle: (opponentShips) => {
            setPlayer2Ships(opponentShips)
            setGamePhase("battle")
        },
        onReceiveGuess: (coordinate) => {
            const isHit = player1Ships.some((ship) => ship.positions.includes(coordinate))
            const updatedHits = isHit ? [...player2Hits, coordinate] : player2Hits
            const updatedMisses = !isHit ? [...player2Misses, coordinate] : player2Misses

            setPlayer2Hits(updatedHits)
            setPlayer2Misses(updatedMisses)

            const allPositions = player1Ships.flatMap(ship => ship.positions)
            const allHit = allPositions.every(pos => updatedHits.includes(pos))

            if (allHit) {
                // sendGaneOver
                sendGameOver("player2")
                setWinner("player2")
                setGamePhase("gameOver")
            } else {
                setCurrentPlayer("player1")
            }

            sendResult({ coordinate, hit: isHit })
        },
        onReceiveResult: ({ coordinate, hit }) => {
            if (hit) {
                const updatedHits = [...player1Hits, coordinate]
                setPlayer1Hits(updatedHits)

                const allPositions = player2Ships.flatMap(ship => ship.positions)
                const allHit = allPositions.every(pos => updatedHits.includes(pos))

                if (allHit) {
                    sendGameOver("player1")
                    setWinner("player1")
                    setGamePhase("gameOver")
                }
            } else {
                setPlayer1Misses([...player1Misses, coordinate])
                setCurrentPlayer("player2")
            }
        },
        onGameOver: (winner) => {
            setWinner(winner)
            setGamePhase("gameOver")
        }
    })

    const handlePlaceShips = (ships: Ship[]) => {
        setPlayer1Ships(ships)
    }
    const handlePlayerReady = () => {
        if (player1Ships.length < 5) {
            setNotificationMessage("Place all your ships before getting ready!")
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
            return
        }

        setIsPlayerReady(true)
        emitReady(player1Ships)
    }

    const handleSurrender = () => {
        sendGameOver("player1")
        setWinner("player2")
        setGamePhase("gameOver")
        setNotificationMessage("You surrendered the battle!")
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
    }

    const handleLeaveGame = () => {
        navigate("/games/battleship")
    }

    const handlePlayAgain = () => {
        setGamePhase("preparation")
        setCurrentPlayer("player1")
        setPlayer1Ships([])
        setPlayer1Ships([])
        setPlayer1Hits([])
        setPlayer2Hits([])
        setPlayer1Misses([])
        setPlayer2Misses([])
        setWinner(null)
        setIsPlayerReady(false)
        setIsOpponentReady(false)
    }

    const isMyTurn = currentPlayer === "player1" && gamePhase === "battle";
    const handleGuess = (coordinate: string) => {
        if (!isMyTurn) return;
        sendGuess(coordinate);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-yellow-300">ShipBattle Guess</h1>
                        <p className="text-gray-200">Room ID: {roomId}</p>
                    </div>
                    <div className="flex gap-4">
                        {gamePhase === "battle" && (
                            <Button
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500/10 cursor-pointer hover:text-gray-200"
                                onClick={handleSurrender}
                            >
                                Surrender
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="border-gray-500 text-gray-500 hover:bg-gray-500/10 text-md hover:text-gray-300 font-bold cursor-pointer"
                            onClick={handleLeaveGame}
                        >
                            Leave Game
                        </Button>
                    </div>
                </div>

                {showNotification && <Notification message={notificationMessage} />}

                <GameStatus
                    gamePhase={gamePhase}
                    currentPlayer={currentPlayer}
                    playerName={playerName}
                    opponentName={opponentName || "Waiting for opponent..."}
                    winner={winner}
                    partnerJoined={partnerJoined}
                    isPlayerReady={isPlayerReady}
                    isOpponentReady={isOpponentReady}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        {gamePhase === "waiting" && <WaitingRoom roomId={roomId} onPartnerJoin={() => { }} />}

                        {gamePhase === "preparation" && (
                            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-yellow-300">Place Your Ships</h2>
                                    <ReadyButton isReady={isPlayerReady} onReady={handlePlayerReady} disabled={player1Ships.length < 5} />
                                </div>
                                <GameBoard
                                    isPlacementPhase={true}
                                    onPlaceShips={handlePlaceShips}
                                    playerShips={player1Ships}
                                    opponentShips={[]}
                                    playerHits={[]}
                                    playerMisses={[]}
                                    opponentHits={[]}
                                    opponentMisses={[]}
                                    onGuess={() => { }}
                                    currentPlayer={currentPlayer}
                                />
                            </div>
                        )}

                        {gamePhase === "battle" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                    <h2 className="text-lg font-bold mb-2 text-gray-100">Your Fleet</h2>
                                    <GameBoard
                                        isPlacementPhase={false}
                                        playerView={true}
                                        playerShips={player1Ships}
                                        opponentShips={player2Ships}
                                        playerHits={player1Hits}
                                        playerMisses={player1Misses}
                                        opponentHits={player2Hits}
                                        opponentMisses={player2Misses}
                                        onGuess={() => { }}
                                        currentPlayer={currentPlayer}
                                    />
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                    <h2 className="text-lg font-bold mb-2 text-gray-100">Enemy Waters</h2>
                                    <GameBoard
                                        isPlacementPhase={false}
                                        playerView={false}
                                        playerShips={player1Ships}
                                        opponentShips={player2Ships}
                                        playerHits={player1Hits}
                                        playerMisses={player1Misses}
                                        opponentHits={player2Hits}
                                        opponentMisses={player2Misses}
                                        onGuess={handleGuess}
                                        currentPlayer={currentPlayer}
                                    />
                                </div>
                            </div>
                        )}

                        {gamePhase === "gameOver" && (
                            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 text-center">
                                <h2 className="text-2xl font-bold mb-4 text-yellow-300">
                                    {winner === "player1" ? "Victory!" : "Defeat!"}
                                </h2>
                                <p className="text-gray-100 mb-6">
                                    {winner === "player1"
                                        ? "You have sunk all enemy ships and won the battle!"
                                        : "All your ships have been sunk. Better luck next time!"}
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold cursor-pointer"
                                        onClick={handlePlayAgain}
                                    >
                                        Play Again
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-gray-500 text-gray-700 hover:bg-gray-500/10 hover:text-gray-300 cursor-pointer"
                                        onClick={handleLeaveGame}
                                    >
                                        Return to Home
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 h-[600px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-yellow-300">Battle Chat</h2>
                        <ChatBox
                            roomId={roomId}
                            playerName={playerName}
                            opponentName={opponentName}
                            disabled={!partnerJoined || gamePhase === "waiting"}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
