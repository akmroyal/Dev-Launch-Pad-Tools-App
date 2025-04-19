export type ShipType = "carrier" | "battleship" | "cruiser" | "submarine" | "destroyer"

export type Ship = {
  id: string
  type: ShipType
  positions: string[]
  orientation: "horizontal" | "vertical"
  imageUrl?: string
}

export type Player = "player1" | "player2"

export type GamePhase = "waiting" | "preparation" | "battle" | "gameOver"
