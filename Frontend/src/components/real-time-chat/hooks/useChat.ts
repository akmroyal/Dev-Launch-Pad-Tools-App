import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/lib/index';
import socket from '@/lib/socket';

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  error: string | null;
  isConnecting: boolean;
}

export function useChat(roomId: string, username: string) {
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
    socket.connect();

    const handleConnect = () => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null
      }));
      socket.emit('join_room', { roomId, username });
    };

    const handleDisconnect = () => {
      setState(prev => ({ ...prev, isConnected: false, isConnecting: false }));
    };

    const handleReceiveMessage = (message: Message) => {
      addMessage(message);
    };

    const handleUserJoined = ({ username: joinedUser }: { username: string }) => {
      addMessage({
        id: crypto.randomUUID(),
        text: `${joinedUser} has joined the room`,
        username: 'System',
        sender: 'System',
        isSystem: true,
        timestamp: Date.now()
      });
    };

    const handleUserLeft = ({ username: leftUser }: { username: string }) => {
      addMessage({
        id: crypto.randomUUID(),
        text: `${leftUser} has left the room`,
        username: 'System',
        sender: 'System',
        isSystem: true,
        timestamp: Date.now()
      });
    };

    const handleRoomData = (room: { messages: Message[] }) => {
      setState(prev => ({ ...prev, messages: room.messages }));
    };

    const handleRoomUserCount = ({ count }: { count: number }) => {
      setUserCount(count);
    };

    const handleConnectError = (err: Error) => {
      console.error('Connection error:', err);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: 'Connection error: ' + err.message
      }));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('room_data', handleRoomData);
    socket.on('room_user_count', handleRoomUserCount);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.emit('leave_room', { roomId, username });
      socket.disconnect();
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('room_data', handleRoomData);
      socket.off('room_user_count', handleRoomUserCount);
      socket.off('connect_error', handleConnectError);
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
    addMessage({ ...message, isLocal: true });
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
