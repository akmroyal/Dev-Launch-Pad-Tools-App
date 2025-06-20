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
  