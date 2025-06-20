
export interface Message {
  id: string;
  text: string;
  username: string;
  isSystem: boolean;
  timestamp: number;
}

export interface Room {
  id: string;
  users: string[];
  messages: Message[];
}

export interface JoinRoomData {
  roomId: string;
  username: string;
}

export interface SendMessageData {
  roomId: string;
  message: Message;
}

export interface PlayerReadyData {
  roomId: string;
  ships: any[];
}

export interface GuessData {
  roomId: string;
  coordinate: string;
}

export interface ResultData {
  roomId: string;
  result: string;
}

export interface GameOverData {
  roomId: string;
  winner: string;
}

export interface RoomOnly {
  roomId: string;
}
