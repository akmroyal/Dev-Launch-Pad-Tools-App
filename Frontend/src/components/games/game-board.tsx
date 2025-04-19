import React from "react"
import { useState, useEffect, useRef } from "react"
import { RotateCw } from "lucide-react"
import type { Ship, ShipType, Player } from "@/lib/game-types"

type GameBoardProps = {
  isPlacementPhase?: boolean
  playerView?: boolean
  playerShips: Ship[]
  opponentShips: Ship[]
  playerHits: string[]
  playerMisses: string[]
  opponentHits: string[]
  opponentMisses: string[]
  onGuess: (coordinate: string) => void
  onPlaceShips?: (ships: Ship[]) => void
  currentPlayer: Player
}

export default function GameBoard({
  isPlacementPhase = false,
  playerView = true,
  playerShips,
  // opponentShips,
  playerHits,
  playerMisses,
  opponentHits,
  opponentMisses,
  onGuess,
  onPlaceShips,
  currentPlayer,
}: GameBoardProps) {
  const [selectedShipType, setSelectedShipType] = useState<ShipType | null>(null)
  const [selectedOrientation, setSelectedOrientation] = useState<"horizontal" | "vertical">("horizontal")
  const [placedShips, setPlacedShips] = useState<Ship[]>([])
  const [hoverCoordinate, setHoverCoordinate] = useState<string | null>(null)
  // const [draggingShip, setDraggingShip] = useState<Ship | null>(null)
  const [showRotateIcon, setShowRotateIcon] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const shipSizes: Record<ShipType, number> = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  }

  const shipImages: Record<ShipType, string> = {
    carrier: "/placeholder.svg?height=50&width=250",
    battleship: "/placeholder.svg?height=50&width=200",
    cruiser: "/placeholder.svg?height=50&width=150",
    submarine: "/placeholder.svg?height=50&width=150",
    destroyer: "/placeholder.svg?height=50&width=100",
  }

  useEffect(() => {
    if (onPlaceShips) {
      onPlaceShips(placedShips)
    }
  }, [placedShips, onPlaceShips])

  const getShipPositions = (
    startCoord: string,
    shipType: ShipType,
    orientation: "horizontal" | "vertical",
  ): string[] => {
    const positions: string[] = []
    const row = startCoord.charAt(0)
    const col = Number.parseInt(startCoord.substring(1))
    const size = shipSizes[shipType]

    for (let i = 0; i < size; i++) {
      if (orientation === "horizontal") {
        if (col + i > 10) return [] // Out of bounds
        positions.push(`${row}${col + i}`)
      } else {
        const newRowCharCode = row.charCodeAt(0) + i
        if (newRowCharCode > 74) return [] // Out of bounds (J is 74)
        positions.push(`${String.fromCharCode(newRowCharCode)}${col}`)
      }
    }

    return positions
  }

  const isValidPlacement = (positions: string[]): boolean => {
    if (positions.length === 0) return false

    // Check if positions overlap with existing ships
    for (const ship of placedShips) {
      for (const pos of positions) {
        if (ship.positions.includes(pos)) {
          return false
        }
      }
    }

    return true
  }

  const handleCellClick = (coordinate: string) => {
    if (isPlacementPhase) {
      if (!selectedShipType) return

      const positions = getShipPositions(coordinate, selectedShipType, selectedOrientation)
      if (!isValidPlacement(positions)) return

      const newShip: Ship = {
        id: `ship-${Date.now()}`,
        type: selectedShipType,
        positions,
        orientation: selectedOrientation,
        imageUrl: shipImages[selectedShipType],
      }

      setPlacedShips([...placedShips, newShip])

      // Remove the placed ship type from selection
      setSelectedShipType(null)
    } else if (!playerView && currentPlayer === "player1") {
      onGuess(coordinate)
    }
  }

  const handleMouseEnter = (coordinate: string) => {
    if (isPlacementPhase && selectedShipType) {
      setHoverCoordinate(coordinate)
    }
  }

  const handleMouseLeave = () => {
    setHoverCoordinate(null)
  }

  const handleShipClick = (shipId: string) => {
    if (!isPlacementPhase) return

    setShowRotateIcon(showRotateIcon === shipId ? null : shipId)
  }

  const handleRotateShip = (shipId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const shipIndex = placedShips.findIndex((ship) => ship.id === shipId)
    if (shipIndex === -1) return

    const ship = placedShips[shipIndex]
    const newOrientation: "horizontal" | "vertical" = ship.orientation === "horizontal" ? "vertical" : "horizontal"

    // Get the starting position (top-left corner)
    const startPosition = ship.positions[0]

    // Calculate new positions based on the new orientation
    const newPositions = getShipPositions(startPosition, ship.type, newOrientation)

    // Check if the new positions are valid
    if (!isValidPlacement(newPositions)) return

    // Update the ship
    const updatedShip = {
      ...ship,
      orientation: newOrientation,
      positions: newPositions,
    }

    const newShips = [...placedShips]
    newShips[shipIndex] = updatedShip

    setPlacedShips(newShips)
    setShowRotateIcon(null)
  }

  const handleDragStart = (e: React.DragEvent, shipType: ShipType) => {
    e.dataTransfer.setData("shipType", shipType)
    setSelectedShipType(shipType)
  }

  const handleDragOver = (e: React.DragEvent, coordinate: string) => {
    e.preventDefault()
    setHoverCoordinate(coordinate)
  }

  const handleDrop = (e: React.DragEvent, coordinate: string) => {
    e.preventDefault()

    const shipType = e.dataTransfer.getData("shipType") as ShipType
    if (!shipType) return

    const positions = getShipPositions(coordinate, shipType, selectedOrientation)
    if (!isValidPlacement(positions)) return

    const newShip: Ship = {
      id: `ship-${Date.now()}`,
      type: shipType,
      positions,
      orientation: selectedOrientation,
      imageUrl: shipImages[shipType],
    }

    setPlacedShips([...placedShips, newShip])
    setSelectedShipType(null)
    setHoverCoordinate(null)
  }

  const getCellContent = (coordinate: string) => {
    if (isPlacementPhase) {
      // Show placed ships during placement phase
      for (const ship of placedShips) {
        if (ship.positions.includes(coordinate)) {
          // Only show the ship image on the first cell of the ship
          if (ship.positions[0] === coordinate) {
            return (
              <div
                className={`absolute ${ship.orientation === "horizontal" ? "h-[30px]" : "w-[30px]"
                  } flex items-center justify-center cursor-pointer`}
                style={{
                  width: ship.orientation === "horizontal" ? `${ship.positions.length * 30}px` : "30px",
                  height: ship.orientation === "vertical" ? `${ship.positions.length * 30}px` : "30px",
                }}
                onClick={() => handleShipClick(ship.id)}
              >
                <div
                  className={`bg-yellow-500 rounded-sm w-full h-full flex items-center justify-center relative ${showRotateIcon === ship.id ? "ring-2 ring-white" : ""
                    }`}
                >
                  {showRotateIcon === ship.id && (
                    <button
                      className="absolute -top-4 -right-4 bg-gray-600 rounded-full p-1 hover:bg-gray-500 transition-colors"
                      onClick={(e) => handleRotateShip(ship.id, e)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          }
          return null
        }
      }

      // Show hover preview during placement
      if (selectedShipType && hoverCoordinate) {
        const positions = getShipPositions(hoverCoordinate, selectedShipType, selectedOrientation)
        if (positions.includes(coordinate)) {
          return (
            <div
              className={`w-full h-full rounded-sm flex items-center justify-center ${isValidPlacement(positions) ? "bg-green-500/50" : "bg-red-500/50"
                }`}
            >
              {coordinate === hoverCoordinate && <span className="text-xs">🚢</span>}
            </div>
          )
        }
      }

      return null
    }

    if (playerView) {
      // Player's own board view
      const isPlayerShip = playerShips.some((ship) => ship.positions.includes(coordinate))
      const isHitByOpponent = opponentHits.includes(coordinate)
      const isMissedByOpponent = opponentMisses.includes(coordinate)

      if (isPlayerShip && isHitByOpponent) {
        return <div className="w-full h-full bg-red-500 rounded-sm flex items-center justify-center">💥</div>
      } else if (isPlayerShip) {
        // Find the ship that this coordinate belongs to
        const ship = playerShips.find((s) => s.positions.includes(coordinate))
        if (ship && ship.positions[0] === coordinate) {
          return (
            <div
              className={`absolute ${ship.orientation === "horizontal" ? "h-[30px]" : "w-[30px]"}`}
              style={{
                width: ship.orientation === "horizontal" ? `${ship.positions.length * 30}px` : "30px",
                height: ship.orientation === "vertical" ? `${ship.positions.length * 30}px` : "30px",
              }}
            >
              <div className="bg-yellow-500 rounded-sm w-full h-full"></div>
            </div>
          )
        }
        return null
      } else if (isMissedByOpponent) {
        return <div className="w-full h-full flex items-center justify-center">•</div>
      }
    } else {
      // Opponent's board view
      const isHitByPlayer = playerHits.includes(coordinate)
      const isMissedByPlayer = playerMisses.includes(coordinate)

      if (isHitByPlayer) {
        return <div className="w-full h-full bg-red-500 rounded-sm flex items-center justify-center">💥</div>
      } else if (isMissedByPlayer) {
        return <div className="w-full h-full flex items-center justify-center">•</div>
      }
    }

    return null
  }

  const getAvailableShips = () => {
    const shipTypes: ShipType[] = ["carrier", "battleship", "cruiser", "submarine", "destroyer"]
    const placedShipTypes = placedShips.map((ship) => ship.type)
    return shipTypes.filter((type) => !placedShipTypes.includes(type))
  }

  const getCellClassName = (coordinate: string) => {
    let className =
      "w-full border border-gray-700 bg-gray-900/30 hover:bg-gray-800/50 transition-colors duration-200 flex items-center justify-center relative"

    if (!isPlacementPhase && !playerView) {
      const alreadyGuessed = [...playerHits, ...playerMisses].includes(coordinate)
      if (alreadyGuessed || currentPlayer !== "player1") {
        className += " cursor-not-allowed opacity-80"
      } else {
        className += " cursor-pointer"
      }
    }

    return className
  }

  return (
    <div>
      {isPlacementPhase && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-800/30 rounded-lg">
            <p className="w-full text-gray-200 mb-2">Available Ships (Drag to place or click to select):</p>
            {getAvailableShips().map((shipType) => (
              <div
                key={shipType}
                className={`px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-100 hover:bg-gray-700 cursor-grab flex items-center gap-2 ${selectedShipType === shipType ? "ring-2 ring-yellow-400" : ""
                  }`}
                onClick={() => setSelectedShipType(shipType)}
                draggable
                onDragStart={(e) => handleDragStart(e, shipType)}
              >
                <div
                  className="bg-yellow-500 rounded-sm"
                  style={{
                    width: `${shipSizes[shipType] * 15}px`,
                    height: "15px",
                  }}
                ></div>
                {shipType.charAt(0).toUpperCase() + shipType.slice(1)} ({shipSizes[shipType]})
              </div>
            ))}
          </div>

          {selectedShipType && (
            <div className="flex gap-4 mb-4">
              <button
                className={`px-3 py-1 rounded-md text-sm ${selectedOrientation === "horizontal"
                    ? "bg-yellow-500 text-gray-950"
                    : "bg-gray-800 text-gray-100 hover:bg-gray-700"
                  }`}
                onClick={() => setSelectedOrientation("horizontal")}
              >
                Horizontal
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${selectedOrientation === "vertical"
                    ? "bg-yellow-500 text-gray-950"
                    : "bg-gray-800 text-gray-100 hover:bg-gray-700"
                  }`}
                onClick={() => setSelectedOrientation("vertical")}
              >
                Vertical
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-11 gap-1" ref={boardRef}>
        {/* Column headers */}
        <div className="w-[30px] h-[30px]"></div>
        {cols.map((col) => (
          <div
            key={col}
            className="w-[30px] h-[30px] flex items-center justify-center text-gray-300 text-xs font-semibold "
          >
            {col}
          </div>
        ))}

        {/* Rows */}
        {rows.map((row) => (
          <React.Fragment key={row}>
            {/* Row header */}
            <div className="w-[30px] h-[30px] flex items-center justify-center text-gray-300 text-xs font-semibold ">
              {row}
            </div>

            {/* Cells */}
            {cols.map((col) => {
              const coordinate = `${row}${col}`
              return (
                <div
                  key={coordinate}
                  className={getCellClassName(coordinate)}
                  onClick={() => handleCellClick(coordinate)}
                  onMouseEnter={() => handleMouseEnter(coordinate)}
                  onMouseLeave={handleMouseLeave}
                  onDragOver={(e) => handleDragOver(e, coordinate)}
                  onDrop={(e) => handleDrop(e, coordinate)}
                >
                  {getCellContent(coordinate)}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
