export type Message = {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    isSystem?: boolean;
    isLocal?: boolean;
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