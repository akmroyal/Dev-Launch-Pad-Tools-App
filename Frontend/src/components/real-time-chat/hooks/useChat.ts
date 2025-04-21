import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { Message } from '@/components/types';

const getSocketUrl = () => {
  return import.meta.env.MODE === 'development'
    ? 'http://localhost:3001'
    : 'https://your-socket-server.com';
};

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  error: string | null;
  isConnecting: boolean;
}

export function useChat(roomId: string, username: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    error: null,
    isConnecting: false,
  });

  const [userCount, setUserCount] = useState(1); // ✅ new

  const addMessage = useCallback((message: Message) => {
    setState(prev => {
      const updatedMessages = [...prev.messages, message];
      if (updatedMessages.length > 100) updatedMessages.shift();
      return { ...prev, messages: updatedMessages };
    });
  }, []);

  useEffect(() => {
    if (!roomId) return;

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    const socketInstance = io(getSocketUrl(), {
      withCredentials: true,
    });

    setSocket(socketInstance);

    const handleConnect = () => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null
      }));
      socketInstance.emit('join_room', { roomId, username });
    };

    const handleDisconnect = () => {
      setState(prev => ({ ...prev, isConnected: false, isConnecting: false }));
    };

    const handleReceiveMessage = (message: Message) => {
      addMessage(message);
    };

    const handleUserJoined = ({ username: joinedUser }) => {
      addMessage({
        id: crypto.randomUUID(),
        text: `${joinedUser} has joined the room`,
        username: 'System',
        sender: 'System',
        isSystem: true,
        timestamp: Date.now()
      });
    };

    const handleUserLeft = ({ username: leftUser }) => {
      addMessage({
        id: crypto.randomUUID(),
        text: `${leftUser} has left the room`,
        username: 'System',
        sender: 'System',
        isSystem: true,
        timestamp: Date.now()
      });
    };

    const handleRoomData = (room) => {
      setState(prev => ({ ...prev, messages: room.messages }));
    };

    const handleRoomUserCount = ({ count }: { count: number }) => {
      setUserCount(count);
    };

    const handleConnectError = (err: any) => {
      console.error('Connection error:', err);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: 'Connection error: ' + err.message
      }));
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('receive_message', handleReceiveMessage);
    socketInstance.on('user_joined', handleUserJoined);
    socketInstance.on('user_left', handleUserLeft);
    socketInstance.on('room_data', handleRoomData);
    socketInstance.on('room_user_count', handleRoomUserCount);
    socketInstance.on('connect_error', handleConnectError);

    return () => {
      socketInstance.emit('leave_room', { roomId, username });
      socketInstance.disconnect();
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('receive_message', handleReceiveMessage);
      socketInstance.off('user_joined', handleUserJoined);
      socketInstance.off('user_left', handleUserLeft);
      socketInstance.off('room_data', handleRoomData);
      socketInstance.off('room_user_count', handleRoomUserCount);
      socketInstance.off('connect_error', handleConnectError);
    };
  }, [roomId, username, addMessage]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || !socket || !state.isConnected) return;

    const message: Message = {
      id: crypto.randomUUID(),
      text,
      username,
      sender: username,
      isSystem: false,
      timestamp: Date.now()
    };

    socket.emit('send_message', { roomId, message });
    addMessage({ ...message, isLocal: true }); // show instantly
  }, [socket, state.isConnected, roomId, username, addMessage]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.connect();
    }
  }, [socket]);

  return {
    messages: state.messages,
    sendMessage,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    reconnect,
    userCount,
  };
}
