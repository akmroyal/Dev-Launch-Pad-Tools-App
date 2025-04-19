import { useState, useEffect, useCallback, useRef } from 'react'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: string
  isLocal?: boolean
}

interface ChatState {
  messages: Message[]
  isConnected: boolean
  error: string | null
  isConnecting: boolean
}

// Determine WebSocket URL based on environment
const getWebSocketUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'ws://localhost:8080'
  }
  // For production, you'll replace this with your actual WebSocket server URL
  return 'wss://your-websocket-server.com'
}

export function useChat(roomId: string, username: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    error: null,
    isConnecting: false,
  })
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const addMessage = useCallback((message: Message) => {
    setState(prev => {
      const updatedMessages = [...prev.messages, message]
      
      // Auto-delete old messages when we reach 100
      if (updatedMessages.length > 100) {
        updatedMessages.shift()
      }
      
      return {
        ...prev,
        messages: updatedMessages
      }
    })
  }, [])

  const connect = useCallback(() => {
    if (!roomId || state.isConnected || state.isConnecting) return

    setState(prev => ({ ...prev, isConnecting: true, error: null }))
    
    const socketUrl = getWebSocketUrl()
    const socket = new WebSocket(socketUrl)
    socketRef.current = socket

    socket.onopen = () => {
      reconnectAttempts.current = 0
      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isConnecting: false,
        error: null 
      }))
      
      // Join the room
      socket.send(JSON.stringify({
        type: 'join',
        roomId,
        username
      }))
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'message') {
          addMessage({
            ...data,
            isLocal: false
          })
        }
        else if (data.type === 'notification') {
          addMessage({
            id: Date.now().toString(),
            text: data.text,
            sender: 'System',
            timestamp: new Date().toISOString(),
            isLocal: false
          })
        }
        else if (data.type === 'history') {
          // Handle message history if implemented on server
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: 'Connection error'
      }))
    }

    socket.onclose = (event) => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false
      }))
      
      // Attempt reconnection if this wasn't a normal closure
      if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1
        const delay = Math.min(1000 * reconnectAttempts.current, 5000) // Exponential backoff max 5s
        setTimeout(connect, delay)
      }
    }

    return socket
  }, [roomId, username, addMessage, state.isConnected, state.isConnecting])

  useEffect(() => {
    const socket = connect()
    
    return () => {
      socket?.close()
      socketRef.current = null
    }
  }, [connect])

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || !socketRef.current || !state.isConnected) return

    const message = {
      id: Date.now().toString(),
      text,
      sender: username,
      timestamp: new Date().toISOString(),
      isLocal: true
    }

    // Optimistically add local message
    addMessage(message)

    // Send to server
    try {
      socketRef.current.send(JSON.stringify({
        type: 'message',
        text: message.text
      }))
    } catch (error) {
      console.error('Error sending message:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to send message'
      }))
    }
  }, [username, addMessage, state.isConnected])

  return {
    messages: state.messages,
    sendMessage,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    reconnect: connect,
  }
}