'use client'

import { useState } from 'react'
import { ChatMessage } from '@/lib/sessionStorage'

interface ChatHistoryPanelProps {
  chatHistory: ChatMessage[]
  sessionId: string | null
  onClearHistory: () => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export default function ChatHistoryPanel({
  chatHistory,
  sessionId,
  onClearHistory,
  isVisible,
  onToggleVisibility
}: ChatHistoryPanelProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleClearHistory = () => {
    onClearHistory()
    setShowConfirmClear(false)
  }

  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#2a2a2a',
          color: '#e0e0e0',
          border: '1px solid #444',
          borderRadius: '5px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 100
        }}
        title="Show Chat History"
      >
        📜 History ({chatHistory.length})
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      maxHeight: '500px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '10px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#e0e0e0', fontSize: '16px' }}>
            Chat History
          </h3>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            Session: {sessionId?.slice(-8) || 'None'}
          </div>
        </div>
        <button
          onClick={onToggleVisibility}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            width: '24px',
            height: '24px'
          }}
          title="Hide History"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        maxHeight: '350px'
      }}>
        {chatHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#666',
            padding: '20px',
            fontSize: '14px'
          }}>
            No chat history yet.<br />
            Start a conversation to see it here.
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: message.role === 'user' ? '#2a2a3a' : '#2a3a2a',
                borderRadius: '6px',
                borderLeft: `3px solid ${message.role === 'user' ? '#4a9eff' : '#ff6b6b'}`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: message.role === 'user' ? '#4a9eff' : '#ff6b6b',
                  textTransform: 'uppercase'
                }}>
                  {message.role === 'user' ? 'You' : 'Spirit'}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: '#888'
                }}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div style={{
                fontSize: '13px',
                color: '#e0e0e0',
                lineHeight: '1.4',
                wordWrap: 'break-word'
              }}>
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 15px',
        borderTop: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '11px', color: '#666' }}>
          {chatHistory.length} messages
        </div>
        
        {showConfirmClear ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={handleClearHistory}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              style={{
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmClear(true)}
            disabled={chatHistory.length === 0}
            style={{
              backgroundColor: chatHistory.length === 0 ? '#333' : '#666',
              color: chatHistory.length === 0 ? '#666' : '#e0e0e0',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: chatHistory.length === 0 ? 'not-allowed' : 'pointer'
            }}
            title="Clear chat history"
          >
            🗑️ Clear
          </button>
        )}
      </div>
    </div>
  )
}