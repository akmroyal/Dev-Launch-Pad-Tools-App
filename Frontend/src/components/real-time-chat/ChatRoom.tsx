import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router'
import { useChat } from './hooks/useChat'
import { FaCopy, FaSignOutAlt, FaSync } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserGroup } from "react-icons/fa6";

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const username = location.state?.username || location.state?.usernameForjoin || 'Anonymous'
  const {
    messages,
    sendMessage,
    isConnected,
    isConnecting,
    error,
    reconnect,
    userCount
  } = useChat(roomId || '', username);


  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLeaveRoom = () => {
    navigate('/games/roomchat')
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#e4e3e3] text-gray-900 p-4 shadow-md text-xl">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl">Room: <span className='font-bold'>{roomId}</span></h1>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId || '')
                  alert('Room ID copied to clipboard!')
                }}
                className="text-gray hover:text-gray-600 transition-colors cursor-pointer"
                title="Copy Room ID"
              >
                <FaCopy />
              </button>
            </div>
            <div className='flex'>
              <span className='flex items-center gap-1'><FaUserGroup />{userCount}</span>

            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center space-x-2 gap-2">
              <span className="text-gray-900 ">Hello, <span className='font-bold'>{username}</span></span>
              <div className='flex items-center space-x-2  text-gray-900 font-semibold px-2 rounded-2xl'>
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' :
                  isConnecting ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                <span className="text-gray text-sm">
                  {isConnected ? 'Connected' :
                    isConnecting ? 'Connecting...' : 'Disconnected'}
                </span>
                {!isConnected && !isConnecting && (
                  <button
                    onClick={reconnect}
                    className="text-gray hover:text-gray-200 transition-colors"
                    title="Reconnect"
                  >
                    <FaSync />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleLeaveRoom}
              className="bg-gray text-primary px-4 py-1 rounded-lg font-medium hover:bg-opacity-90 transition-opacity flex items-center space-x-1 cursor-pointer hover:bg-gray-500"
            >
              <FaSignOutAlt />
              <span>Leave</span>
            </button>
          </div>
        </div>
      </header>

      {/* Connection error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500 text-gray p-2 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat messages */}
      <div className="flex-1 container mx-auto p-4 overflow-y-auto bg-gray-200">
        <div className="mx-auto bg-gray-100 rounded-xl shadow-md p-4 h-[65vh] overflow-y-auto">
          {messages.length === 0 && !isConnecting ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              {isConnected ? 'No messages yet. Say hello!' : 'Not connected to chat'}
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${(msg.sender || msg.username) === username ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${(msg.sender || msg.username) === username
                        ? 'bg-primary text-gray-200 rounded-br-none'
                        : msg.sender === 'System'
                          ? 'bg-gray-200 text-gray-800 rounded-bl-none'
                          : 'bg-secondary text-gray-700 rounded-bl-none'
                        } ${msg.isLocal ? 'opacity-80' : ''} outline-2`}
                    >
                      {msg.sender !== username && msg.sender !== 'System' && (
                        <div className="font-bold text-xs mb-1">{msg.sender}</div>
                      )}
                      <div className="text-sm">{msg.text}</div>
                      <div className={`text-xs mt-1 ${(msg.sender || msg.username) === username ? 'text-white/70' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                        {msg.isLocal && ' · Send'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message input */}
      <div className="container mx-auto p-4">
        <div className="max-w-3xl mx-auto bg-gray rounded-xl shadow-sm p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                isConnected
                  ? "Type your message..."
                  : isConnecting
                    ? "Connecting..."
                    : "Not connected"
              }
              disabled={!isConnected}
              className={`flex-1 px-4 py-2 rounded-lg border ${isConnected
                ? 'border-gray-300 focus:ring-2 focus:ring-primary'
                : 'border-gray-200 bg-gray-100'
                } focus:outline-none focus:border-transparent`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected}
              className="bg-accent text-gray px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              Send
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Messages will auto-delete after 100 in this room.
            {!isConnected && ' (Connection required to chat)'}
          </div>
        </div>
      </div>
    </div>
  )
}