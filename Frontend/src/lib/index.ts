export type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  isSystem?: boolean;
  isLocal?: boolean;
  username?: string;
};

export type Room = {
  id: string;
  messages: Message[];
  users: string[];
};

export type SocketEvents = {
  JOIN_ROOM: 'join_room';
  LEAVE_ROOM: 'leave_room';
  CREATE_ROOM: 'create_room';
  ROOM_CREATED: 'room_created';
  USER_JOINED: 'user_joined';
  USER_LEFT: 'user_left';
  SEND_MESSAGE: 'send_message';
  RECEIVE_MESSAGE: 'receive_message';
  ROOM_DATA: 'room_data';
  ERROR: 'error';
};

// Use for the Dynamic Url Page for Socket
export const getSocketUrl = () => {
  // return projectStatus === 'development'
  //   ? 'http://localhost:3001'
  //   : 'https://dev-launchpad-tools-game-app.onrender.com/';
  return import.meta.env.VITE_SOCKET_URL;
};


// Games Types Defined Here 

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

export type UseGameSocketProps = {
  roomId: string;
  onPartnerJoin: (name: string) => void;
  onOpponentReady: () => void;
  onStartBattle: (opponentShips: Ship[]) => void;
  onReceiveGuess: (coordinate: string) => void;
  onReceiveResult: (result: { coordinate: string; hit: boolean }) => void;
  onGameOver: (winner: Player) => void;
};
