import { useState, useEffect, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import GameBoard from "@/components/games/game-board";
// import ChatBox from "@/components/games/chat-box";
import GameStatus from "@/components/games/game-status";
// import WaitingRoom from "@/components/games/waiting-room";
import ReadyButton from "@/components/games/ready-button";
// import Notification from "@/components/games/notification";
import type { Ship, Player, GamePhase } from "@/lib/game-types";
import { useNavigate, useParams } from "react-router";
import { initializeSocket, getSocket, socketActions } from "@/lib/socket";

export default function GameRoom() {
    const params = useParams();
    const navigate = useNavigate();
    const roomId = params.roomId as string;

    const [gameState, setGameState] = useState<{
        phase: GamePhase;
        currentPlayer: Player | null;
        playerShips: Ship[];
        opponentShips: Ship[];
        playerHits: string[];
        playerMisses: string[];
        opponentHits: string[];
        opponentMisses: string[];
        messages: any[];
        playerName: string;
        opponentName: string;
        isCreator: boolean;
        partnerJoined: boolean;
        isPlayerReady: boolean;
        isOpponentReady: boolean;
        winner: Player | null;
    }>({
        phase: "waiting",
        currentPlayer: null,
        playerShips: [],
        opponentShips: [],
        playerHits: [],
        playerMisses: [],
        opponentHits: [],
        opponentMisses: [],
        messages: [],
        playerName: "Player 1",
        opponentName: "",
        isCreator: false,
        partnerJoined: false,
        isPlayerReady: false,
        isOpponentReady: false,
        winner: null,
    });

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    // Initialize socket connection
    useEffect(() => {
        const playerName = localStorage.getItem(`player_${roomId}`) || "Player";

        const socket = initializeSocket(roomId, playerName, {
            onRoomUpdate: (room) => {
                // Handle room state updates from server
                updateGameStateFromServer(room);
            },
            onOpponentJoined: (opponentName) => {
                setNotificationMessage(`${opponentName} has joined the battle!`);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
                setGameState(prev => ({
                    ...prev,
                    opponentName,
                    partnerJoined: true,
                    phase: "preparation"
                }));
            },
            onGameStart: () => {
                setNotificationMessage("Battle started!");
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
                setGameState(prev => ({
                    ...prev,
                    phase: "battle",
                    currentPlayer: "player1" // Or determine from server
                }));
            },
            onMessage: (message) => {
                setGameState(prev => ({
                    ...prev,
                    messages: [...prev.messages, message].slice(-70)
                }));
            },
            onOpponentMove: (move) => {
                // Handle opponent's move
                processOpponentMove(move);
            },
            onGameOver: (winner) => {
                setNotificationMessage(winner === "player1" ? "You won!" : "You lost!");
                setShowNotification(true);
                setGameState(prev => ({
                    ...prev,
                    phase: "gameOver",
                    winner
                }));
            }
        });

        // Check if user is room creator
        const storedRooms = localStorage.getItem("createdRooms");
        const isCreator = storedRooms ? JSON.parse(storedRooms).includes(roomId) : false;
        setGameState(prev => ({ ...prev, isCreator, playerName }));

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    const updateGameStateFromServer = useCallback((roomData: any) => {
        // Transform server room data to client state
        setGameState(prev => {
            const opponent = roomData.players.find((p: any) => p.id !== getSocket().id);
            const currentPlayer = roomData.players.find((p: any) => p.id === roomData.currentPlayer);

            return {
                ...prev,
                phase: roomData.phase,
                currentPlayer: currentPlayer?.name === prev.playerName ? "player1" : "player2",
                opponentName: opponent?.name || "",
                partnerJoined: roomData.players.length > 1,
                isPlayerReady: roomData.players.find((p: any) => p.id === getSocket().id)?.ready || false,
                isOpponentReady: opponent?.ready || false,
                opponentShips: opponent?.ships || [],
                messages: roomData.messages || []
            };
        });
    }, []);

    const processOpponentMove = useCallback((move: any) => {
        // Process opponent's move and update game state
        setGameState(prev => {
            const isHit = prev.playerShips.some(ship =>
                ship.positions.includes(move.coordinate)
            );

            if (isHit) {
                const newHits = [...prev.opponentHits, move.coordinate];
                const allSunk = prev.playerShips.every(ship =>
                    ship.positions.every(pos => newHits.includes(pos))
                );

                return {
                    ...prev,
                    opponentHits: newHits,
                    phase: allSunk ? "gameOver" : prev.phase,
                    winner: allSunk ? "player2" : null,
                    currentPlayer: allSunk ? null : "player1"
                };
            } else {
                return {
                    ...prev,
                    opponentMisses: [...prev.opponentMisses, move.coordinate],
                    currentPlayer: "player1"
                };
            }
        });
    }, []);

    const handlePlaceShips = useCallback((ships: Ship[]) => {
        setGameState(prev => ({ ...prev, playerShips: ships }));
    }, []);

    const handlePlayerReady = useCallback(() => {
        if (gameState.playerShips.length < 5) {
            setNotificationMessage("Place all your ships before getting ready!");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return;
        }

        socketActions.readyToPlay(roomId, gameState.playerShips);
    }, [roomId, gameState.playerShips]);

    const handleGuess = useCallback((coordinate: string) => {
        if (gameState.currentPlayer !== "player1" || gameState.phase !== "battle") return;
        if ([...gameState.playerHits, ...gameState.playerMisses].includes(coordinate)) return;

        socketActions.makeMove(roomId, coordinate);

        const isHit = gameState.opponentShips.some(ship =>
            ship.positions.includes(coordinate)
        );

        setGameState(prev => {
            if (isHit) {
                const newHits = [...prev.playerHits, coordinate];
                const allSunk = prev.opponentShips.every(ship =>
                    ship.positions.every(pos => newHits.includes(pos))
                );

                return {
                    ...prev,
                    playerHits: newHits,
                    phase: allSunk ? "gameOver" : prev.phase,
                    winner: allSunk ? "player1" : null,
                    currentPlayer: allSunk ? null : "player1"
                };
            } else {
                return {
                    ...prev,
                    playerMisses: [...prev.playerMisses, coordinate],
                    currentPlayer: "player2"
                };
            }
        });
    }, [roomId, gameState]);

    const handleSurrender = useCallback(() => {
        socketActions.sendMessage(roomId, `${gameState.playerName} surrendered!`);
        setGameState(prev => ({
            ...prev,
            phase: "gameOver",
            winner: "player2"
        }));
        setNotificationMessage("You surrendered the battle!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    }, [roomId, gameState.playerName]);

    const handleLeaveGame = useCallback(() => {
        navigate("/games/battleship");
    }, [navigate]);

    const handlePlayAgain = useCallback(() => {
        socketActions.requestRematch(roomId);
        setGameState(prev => ({
            ...prev,
            phase: "preparation",
            playerShips: [],
            opponentShips: [],
            playerHits: [],
            playerMisses: [],
            opponentHits: [],
            opponentMisses: [],
            isPlayerReady: false,
            isOpponentReady: false,
            winner: null
        }));
    }, [roomId]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
            {/* ... (keep all your existing JSX structure) ... */}
            {/* Replace all state references with gameState */}
            {/* Example: */}
            <GameStatus
                gamePhase={gameState.phase}
                currentPlayer={gameState.currentPlayer}
                playerName={gameState.playerName}
                opponentName={gameState.opponentName || "Waiting for opponent..."}
                winner={gameState.winner}
                partnerJoined={gameState.partnerJoined}
                isPlayerReady={gameState.isPlayerReady}
                isOpponentReady={gameState.isOpponentReady}
            />

            {/* Update all handlers to use the new callbacks */}
            <ReadyButton
                isReady={gameState.isPlayerReady}
                onReady={handlePlayerReady}
                disabled={gameState.playerShips.length < 5}
            />

            {/* ... rest of your JSX ... */}
        </main>
    );
}