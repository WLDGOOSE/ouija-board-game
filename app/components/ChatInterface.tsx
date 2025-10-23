'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatInterfaceProps } from './types'

export default function ChatInterface({ 
  gameMode, 
  messages, 
  onSendMessage, 
  isTyping,
  isSpelling,
  username = 'You'
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() === '' || isSpelling) return
    
    onSendMessage(username, inputMessage, 'user')
    setInputMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>SPIRIT COMMUNICATION</h3>
        {isSpelling && (
          <div style={{
            fontSize: '12px',
            color: '#ff5555',
            marginTop: '5px'
          }}>
            ✨ Spirit is spelling a message...
          </div>
        )}
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type}-message`}
          >
            <strong>
              {message.sender === 'YOU' ? username : 
               message.sender === 'SPIRIT' ? 'SPIRIT' : message.sender}
            </strong>: {message.text}
          </div>
        ))}
        
        {isTyping && !isSpelling && (
          <div className="message system-message">
            <em>Spirit is typing...</em>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder={isSpelling ? "Spirit is spelling... please wait" : "Type your message to the spirits..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!gameMode || isSpelling}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!gameMode || isSpelling || inputMessage.trim() === ''}
        >
          Send
        </button>
      </div>
    </div>
  )
}