import { useState } from 'react'

interface FriendInviteProps {
  roomId: string
  username: string
  onUsernameChange: (username: string) => void
  onFriendJoin: (friendName: string) => void
  onClose: () => void
  onStartSession: () => void  // Add this new prop
}

export default function FriendInvite({ 
  roomId, 
  username, 
  onUsernameChange, 
  onFriendJoin, 
  onClose,
  onStartSession  // Add this prop
}: FriendInviteProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [joinUsername, setJoinUsername] = useState('')

  const copyToClipboard = async () => {
    const inviteLink = `${window.location.origin}?room=${roomId}`
    await navigator.clipboard.writeText(inviteLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleJoinAsFriend = () => {
    const name = joinUsername.trim()
    if (name) {
      onUsernameChange(name)
      onFriendJoin(name)
    }
  }

  // Check if this is a join page by checking URL parameters
  const isJoinPage = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('room')

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '10px',
        border: '1px solid #333',
        minWidth: '400px',
        maxWidth: '500px',
        color: '#e0e0e0'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#e0e0e0' }}>
          {isJoinPage ? 'Join Friend Session' : 'Invite a Friend'}
        </h2>
        
        {!isJoinPage ? (
          // Host view
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Your Name:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#e0e0e0'
                }}
                placeholder="Enter your name"
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>Room ID: <strong>{roomId}</strong></p>
              <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                Share this link with your friend:
              </p>
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={`${window.location.origin}?room=${roomId}`}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isCopied ? '#2a5a2a' : '#5a0a5a',
                    color: '#e0e0e0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#333',
                  color: '#e0e0e0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={onStartSession}  // Use the new prop here
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#5a0a5a',
                  color: '#e0e0e0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Start Session
              </button>
            </div>
          </>
        ) : (
          // Friend join view
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Your Name:
              </label>
              <input
                type="text"
                value={joinUsername}
                onChange={(e) => setJoinUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#e0e0e0'
                }}
                placeholder="Enter your name"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#333',
                  color: '#e0e0e0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleJoinAsFriend}
                disabled={!joinUsername.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: joinUsername.trim() ? '#5a0a5a' : '#333',
                  color: '#e0e0e0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: joinUsername.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Join Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}