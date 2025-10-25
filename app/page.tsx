'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import OuijaBoard from './components/OuijaBoard'
import ChatInterface from './components/ChatInterface'
import ModeSelection from './components/ModeSelection'
import AdPlaceholder from './components/AdPlaceholder'
import AdminPanel from './components/AdminPanel'
import FriendInvite from './components/FriendInvite'
import ChatHistoryPanel from './components/ChatHistoryPanel'
import Footer from './components/Footer'
import { GameMode, Message, Position } from './components/types'
import { useSpiritCommunication } from '@/hooks/useSpiritCommunication'
import { useAI } from '@/hooks/useAI'
import { useRealTimeChat } from '@/hooks/useRealTimeChat'
import { useAnonymousChat } from '@/hooks/useAnonymousChat'

export default function Home() {
  // State declarations
  const [gameMode, setGameMode] = useState<GameMode>(null)
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'SYSTEM', text: 'The board is active. Ask your questions...', type: 'system' }
  ])
  const [planchettePosition, setPlanchettePosition] = useState<Position>({ x: 270, y: 202 })
  const [showAdmin, setShowAdmin] = useState(false)
  const [useAIMode, setUseAIMode] = useState(false)
  const [isSpelling, setIsSpelling] = useState(false)
  const [currentSpelling, setCurrentSpelling] = useState<string>('')
  const [currentLetter, setCurrentLetter] = useState<string>('')
  const [username, setUsername] = useState<string>('User' + Math.floor(Math.random() * 1000))
  const [friendUsername, setFriendUsername] = useState<string>('')
  const [showFriendInvite, setShowFriendInvite] = useState(false)
  const [roomId, setRoomId] = useState<string>('')
  const [onlineUsers, setOnlineUsers] = useState<number>(0)
  const [showAnonymousChat, setShowAnonymousChat] = useState<boolean>(false)
  const [showChatHistory, setShowChatHistory] = useState<boolean>(false)

  // Refs
  const spellingQueueRef = useRef<string[]>([])
  const isSpellingRef = useRef(false)

  // Initialize hooks
  const {
    activeSpirit,
    isSpiritTyping,
    initiateSpiritConnection,
    sendMessageToSpirit,
    endSpiritConnection
  } = useSpiritCommunication()

  const {
    generateAIResponse,
    isAILoading,
    chatHistory,
    clearChatHistory,
    sessionId
  } = useAI()

  // Real-time chat hook
  const {
    isConnected,
    sendMessage,
    sendBoardInteraction,
    sendSpiritResponse,
    onlineUserCount
  } = useRealTimeChat({
    roomId: gameMode === 'friend' ? roomId : undefined,
    username,
    isAnonymous: gameMode === 'anonymous' && showAnonymousChat,
    onNewMessage: useCallback((message: Message) => {
      setMessages(prev => [...prev, message])
    }, []),
    onBoardInteraction: useCallback((data: any) => {
      // Handle board interaction from other users
      if (data.username !== username) {
        movePlanchetteToLetter(data.interaction.value)
        setMessages(prev => [...prev, {
          sender: data.username,
          text: data.interaction.value,
          type: 'user'
        }])
      }
    }, [username]),
    onUserJoined: useCallback((data: any) => {
      setMessages(prev => [...prev, {
        sender: 'SYSTEM',
        text: data.message,
        type: 'system'
      }])
    }, []),
    onUserLeft: useCallback((data: any) => {
      setMessages(prev => [...prev, {
        sender: 'SYSTEM',
        text: data.message,
        type: 'system'
      }])
    }, []),
    onUserCountUpdate: useCallback((count: number) => {
      setOnlineUsers(count);
    }, [])
  })

  const anonChat = useAnonymousChat({
    username,
    onNewMessage: (message) => {
      setMessages(prev => [...prev, message])
    },
    onUserCountUpdate: (count) => setOnlineUsers(count)
  })

  // Letter position mapping
  const letterPositions = useRef<{ [key: string]: Position }>({
    'A': { x: 45, y: 70 }, 'B': { x: 95, y: 70 }, 'C': { x: 145, y: 70 }, 'D': { x: 195, y: 70 }, 'E': { x: 245, y: 70 },
    'F': { x: 295, y: 70 }, 'G': { x: 345, y: 70 }, 'H': { x: 395, y: 70 }, 'I': { x: 445, y: 70 }, 'J': { x: 495, y: 70 },
    'K': { x: 45, y: 120 }, 'L': { x: 95, y: 120 }, 'M': { x: 145, y: 120 }, 'N': { x: 195, y: 120 }, 'O': { x: 245, y: 120 },
    'P': { x: 295, y: 120 }, 'Q': { x: 345, y: 120 }, 'R': { x: 395, y: 120 }, 'S': { x: 445, y: 120 }, 'T': { x: 495, y: 120 },
    'U': { x: 70, y: 170 }, 'V': { x: 120, y: 170 }, 'W': { x: 170, y: 170 }, 'X': { x: 220, y: 170 }, 'Y': { x: 270, y: 170 },
    'Z': { x: 320, y: 170 }, '0': { x: 370, y: 170 }, '1': { x: 420, y: 170 }, '2': { x: 470, y: 170 }, '3': { x: 520, y: 170 },
    '4': { x: 70, y: 220 }, '5': { x: 120, y: 220 }, '6': { x: 170, y: 220 }, '7': { x: 220, y: 220 }, '8': { x: 270, y: 220 },
    '9': { x: 320, y: 220 },
    'YES': { x: 150, y: 280 },
    'NO': { x: 450, y: 280 },
    'GOODBYE': { x: 300, y: 320 },
    ' ': { x: 300, y: 250 }
  })

  // Initialize the game
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])
  // Add this useEffect for debugging
useEffect(() => {
  console.log('🔄 PAGE STATE UPDATE:', {
    gameMode,
    roomId,
    username,
    messagesCount: messages.length,
    isConnected
  });
}, [gameMode, roomId, username, messages.length, isConnected]);

// Add this to see real-time hook activity
useEffect(() => {
  if (gameMode === 'friend') {
    console.log('🎯 FRIEND MODE ACTIVATED:', {
      roomId,
      username,
      isConnected
    });
  }
}, [gameMode, roomId, username, isConnected]);

// Automatically join friend session from URL ?room=...
useEffect(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom) {
      const normalized = urlRoom.toUpperCase();
      setRoomId(normalized);
      setGameMode('friend');
      setShowFriendInvite(true);
      setMessages(prev => [...prev, {
        sender: 'SYSTEM',
        text: `Joining session \"${normalized}\". Enter your name to begin.`,
        type: 'system'
      }]);
    }
  } catch (e) {
    // no-op for SSR safety
  }
}, []);
  // Generate room ID for friend mode
  const generateRoomId = useCallback(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }, [])

  // Move planchette to letter
  const movePlanchetteToLetter = useCallback((letter: string) => {
    const position = letterPositions.current[letter] || { 
      x: Math.random() * 500 + 50, 
      y: Math.random() * 300 + 50 
    }
    setPlanchettePosition(position)
  }, [])

  // Handle goodbye
  const handleGoodbye = useCallback(() => {
    if (!gameMode || isSpelling) return

    // Stop any current spelling
    isSpellingRef.current = false
    setIsSpelling(false)
    spellingQueueRef.current = []

    const goodbyeMessage: Message = { 
      sender: 'SYSTEM', 
      text: 'The connection has been closed.', 
      type: 'system' 
    }
    setMessages(prev => [...prev, goodbyeMessage])

    // Move planchette to goodbye
    movePlanchetteToLetter('GOODBYE')

    // Reset after delay
    setTimeout(() => {
      setGameMode(null)
      setMessages([
        { sender: 'SYSTEM', text: 'The board is active. Ask your questions...', type: 'system' }
      ])
      setPlanchettePosition({ x: 270, y: 202 })
      setCurrentSpelling('')
      endSpiritConnection()
    }, 3000)
  }, [gameMode, endSpiritConnection, movePlanchetteToLetter, isSpelling])

  // Real-time spelling function
  const spellResponse = useCallback(async (response: string) => {
    if (isSpellingRef.current) {
      spellingQueueRef.current.push(response)
      return
    }

    isSpellingRef.current = true
    setIsSpelling(true)

    const letters = response.toUpperCase().split('')
    let currentWord = ''

    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i]
      
      // Set current letter for display in mystic ring
      setCurrentLetter(letter)
      
      // Update current spelling display
      setCurrentSpelling(currentWord + letter)
      currentWord += letter

      // Move planchette to the exact letter position
      const position = letterPositions.current[letter] || { 
        x: Math.random() * 500 + 50, 
        y: Math.random() * 300 + 50 
      }
      setPlanchettePosition(position)

      // Calculate delay based on letter type
      let delay = 300
      if (letter === ' ') delay = 500
      else if (['A', 'E', 'I', 'O', 'U'].includes(letter)) delay = 250
      else if (['M', 'N', 'S'].includes(letter)) delay = 350

      delay += Math.random() * 100 - 50
      await new Promise(resolve => setTimeout(resolve, delay))

      if (!gameMode || !isSpellingRef.current) break
    }

    // Brief pause at the end
    await new Promise(resolve => setTimeout(resolve, 800))

    // Reset spelling state
    setCurrentSpelling('')
    setIsSpelling(false)
    isSpellingRef.current = false

    // Process next message in queue
    if (spellingQueueRef.current.length > 0) {
      const nextResponse = spellingQueueRef.current.shift()!
      setTimeout(() => spellResponse(nextResponse), 500)
    }
  }, [gameMode])

  // Handle mode selection
  const handleModeSelect = useCallback(async (mode: GameMode) => {
    setGameMode(mode)
    
    if (mode === 'anonymous') {
      const spirit = initiateSpiritConnection()
      
      setMessages(prev => [...prev, 
        { 
          sender: 'SYSTEM', 
          text: `You are now connected to the spirit world. ${spirit.name} approaches...`, 
          type: 'system' 
        }
      ])
      
      // Add spirit greeting after a short delay
      setTimeout(async () => {
        let greeting: string
        
        if (useAIMode) {
          greeting = await generateAIResponse(`Generate a mysterious greeting from a spirit named ${spirit.name} with ${spirit.personality} personality. Keep it under 100 characters.`)
        } else {
          // Fallback greetings
          const greetings = [
            "I sense your presence... the veil between worlds trembles.",
            "Welcome, seeker. I have been awaiting your call.",
            "The mists part as you approach. What knowledge do you seek?",
            "Your energy resonates across the dimensions. I am here.",
            "The spirits stir at your arrival. Speak your questions."
          ]
          greeting = greetings[Math.floor(Math.random() * greetings.length)]
        }
        
        const spiritMessage: Message = { 
          sender: spirit.name, 
          text: greeting, 
          type: 'spirit' 
        }
        setMessages(prev => [...prev, spiritMessage])

        // Spell out the greeting with planchette in real-time
        await spellResponse(greeting)
      }, 1000)
      
    } else if (mode === 'friend') {
      // If a room code exists in URL, use it; else generate one
      let selectedRoom = ''
      try {
        const params = new URLSearchParams(window.location.search)
        const urlRoom = params.get('room')
        if (urlRoom) {
          selectedRoom = urlRoom.toUpperCase()
        }
      } catch {}

      const finalRoomId = selectedRoom || generateRoomId()
      setRoomId(finalRoomId)
      setShowFriendInvite(true)
      
      setMessages(prev => [...prev,
        { sender: 'SYSTEM', text: selectedRoom ? `Friend mode activated. Joining session "${finalRoomId}"...` : 'Friend mode activated. Setting up your session...', type: 'system' }
      ])
    }
  }, [initiateSpiritConnection, useAIMode, generateAIResponse, spellResponse, generateRoomId])


  // Handle board interactions
  const handleBoardInteraction = useCallback((interaction: { type: 'letter' | 'yesno' | 'goodbye'; value: string }) => {
    if (!gameMode || isSpelling) return

    let message = ''
    
    switch (interaction.type) {
      case 'letter':
        message = interaction.value
        break
      case 'yesno':
        message = interaction.value
        break
      case 'goodbye':
        handleGoodbye()
        return
    }

    // Add user message locally
    const userMessage: Message = { sender: username, text: message, type: 'user' }
    setMessages(prev => [...prev, userMessage])

    // Move planchette locally
    movePlanchetteToLetter(interaction.value)

    // Send to other users in real-time (friend mode)
    if (gameMode === 'friend') {
      sendBoardInteraction(interaction)
    }

    // Generate spirit response for anonymous mode (disabled when anonymous chat is active)
    if (gameMode === 'anonymous' && activeSpirit && !showAnonymousChat) {
      setTimeout(async () => {
        let response: string
        
        if (useAIMode) {
          const persona = `${activeSpirit.personality} spirit named ${activeSpirit.name}`
          const convo = [...messages, userMessage]
            .filter(m => m.type === 'user' || m.type === 'spirit')
            .slice(-10)
            .map(m => ({ role: m.type === 'spirit' ? 'assistant' as const : 'user' as const, content: m.text }))
          response = await generateAIResponse(message, { persona, history: convo })
        } else {
          response = await sendMessageToSpirit(message)
        }
        
        const spiritMessage: Message = { 
          sender: activeSpirit.name, 
          text: response, 
          type: 'spirit' 
        }
        setMessages(prev => [...prev, spiritMessage])


        // Spell out the response in real-time
        await spellResponse(response)
      }, 1000)
    }
  }, [gameMode, activeSpirit, useAIMode, generateAIResponse, sendMessageToSpirit, movePlanchetteToLetter, isSpelling, spellResponse, handleGoodbye, username, sendBoardInteraction, sendSpiritResponse, showAnonymousChat, messages])

  // Handle chat messages
  const handleChatMessage = useCallback(async (sender: string, text: string, type: Message['type']) => {
    if (isSpelling) return

    const newMessage: Message = { sender, text, type }
    setMessages(prev => [...prev, newMessage])

    if (gameMode === 'friend' && type === 'user') {
      sendMessage(text, type)
    }

    if (gameMode === 'anonymous' && type === 'user' && showAnonymousChat) {
      await anonChat.sendAnonymousMessage(text)
    }

    if (gameMode === 'anonymous' && activeSpirit && type === 'user' && !showAnonymousChat) {
      let response: string
      if (useAIMode) {
        const persona = `${activeSpirit.personality} spirit named ${activeSpirit.name}`
        const convo = [...messages, newMessage]
          .filter(m => m.type === 'user' || m.type === 'spirit')
          .slice(-10)
          .map(m => ({ role: m.type === 'spirit' ? 'assistant' as const : 'user' as const, content: m.text }))
        response = await generateAIResponse(text, { persona, history: convo })
      } else {
        response = await sendMessageToSpirit(text)
      }
      await spellResponse(response)
      const spiritMessage: Message = { sender: activeSpirit.name, text: response, type: 'spirit' }
      setMessages(prev => [...prev, spiritMessage])
    }
  }, [gameMode, activeSpirit, useAIMode, generateAIResponse, sendMessageToSpirit, spellResponse, isSpelling, sendMessage, sendSpiritResponse, showAnonymousChat, anonChat, messages])

  // Handle admin settings
  const handleAdminSettings = useCallback((settings: { useAI: boolean }) => {
    setUseAIMode(settings.useAI)
  }, [])

  // Handle friend joining
  const handleFriendJoin = useCallback((friendName: string) => {
    setFriendUsername(friendName)
    setShowFriendInvite(false)
    setMessages(prev => [...prev,
      { sender: 'SYSTEM', text: `${friendName} has joined the session. You can now communicate through the board.`, type: 'system' }
    ])
  }, [])

  // Handle starting friend session
  const handleStartFriendSession = useCallback(() => {
    setShowFriendInvite(false)
    setMessages(prev => [...prev,
      { sender: 'SYSTEM', text: `Session started! Share the room code "${roomId}" with your friend or wait for them to join.`, type: 'system' }
    ])
  }, [roomId])

  return (
    <main style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          onSettingsChange={handleAdminSettings}
          currentSettings={{ useAI: useAIMode }}
        />
      )}
      
      {/* Friend Invite Modal */}
      {showFriendInvite && gameMode === 'friend' && (
        <FriendInvite
          roomId={roomId}
          username={username}
          onUsernameChange={setUsername}
          onFriendJoin={handleFriendJoin}
          onClose={() => {
            setShowFriendInvite(false)
            setGameMode(null)
          }}
          onStartSession={handleStartFriendSession}
        />
      )}
      
      {/* Mode Selection Screen */}
      {!gameMode && <ModeSelection onModeSelect={handleModeSelect} />}
      
      {/* Connection status indicator */}
      {gameMode === 'friend' && (
        <div style={{
          position: 'fixed', top: 10, left: 10, padding: '5px 10px',
          backgroundColor: isConnected ? 'rgba(0, 128, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)',
          color: 'white', borderRadius: '15px', fontSize: '12px', zIndex: 1000,
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      )}

      {gameMode === 'anonymous' && (
        <div style={{
          position: 'fixed', top: 10, left: 10, padding: '8px 12px',
          backgroundColor: 'rgba(20,20,20,0.8)', color: 'white', borderRadius: '10px',
          fontSize: '12px', zIndex: 1000, border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', gap: '10px', alignItems: 'center'
        }}>
          <label style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input type="checkbox" checked={showAnonymousChat} onChange={(e) => {
              const enabled = e.target.checked;
              setShowAnonymousChat(enabled);
              if (enabled && gameMode === 'anonymous') {
                setUseAIMode(false);
                setMessages(prev => [...prev, { sender: 'SYSTEM', text: 'Anonymous chat enabled. Waiting for a partner...', type: 'system' }]);
                anonChat.startAnonymousChat?.();
              }
            }} />
            Enable Anonymous Chat
          </label>
          <span>Anon online: {onlineUsers}</span>
          {showAnonymousChat && (
            <span style={{ color: '#ccc' }}>
              {anonChat.isPaired ? `Paired with: ${anonChat.partnerName}` : 'Waiting to be paired...'}
            </span>
          )}
          {showAnonymousChat && (
            <button
              style={{ background: '#8b7355', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 10px' }}
              onClick={async () => {
                await anonChat.endAnonymousSession()
                setShowAnonymousChat(false)
                setMessages(prev => [...prev, { sender: 'SYSTEM', text: 'Anonymous session ended.', type: 'system' }])
              }}
            >End Session</button>
          )}
        </div>
      )}
      
      {/* Main Game Container */}
      <div className="container">
        {/* Left Side - Board and Ad */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Ouija Board */}
          <OuijaBoard 
        gameMode={gameMode}
        onInteraction={handleBoardInteraction}
        planchettePosition={planchettePosition}
        messages={messages}
        //isSpelling={isSpelling}
        currentSpelling={currentSpelling}
        currentLetter={currentLetter}
      />
          
          {/* Real-time Spelling Display - Above Ad */}
          {isSpelling && currentSpelling && (
            <div style={{
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              color: '#c8aa6e',
              padding: '25px',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              border: '2px solid #8b7355',
              boxShadow: `
                0 0 40px rgba(199, 156, 78, 0.4),
                inset 0 0 20px rgba(0, 0, 0, 0.8),
                0 4px 8px rgba(0, 0, 0, 0.6)
              `,
              minHeight: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0',
              textShadow: `
                0 0 10px rgba(199, 156, 78, 0.8),
                2px 2px 4px rgba(0, 0, 0, 0.8)
              `,
              fontFamily: 'Cinzel, serif',
              letterSpacing: '3px',
              background: `
                linear-gradient(135deg, 
                  rgba(40, 40, 40, 0.9) 0%,
                  rgba(20, 20, 20, 0.95) 50%,
                  rgba(40, 40, 40, 0.9) 100%
                ),
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(199, 156, 78, 0.1) 2px,
                  rgba(199, 156, 78, 0.1) 4px
                )
              `,
              position: 'relative',
              overflow: 'hidden',
              animation: 'godOfWarPulse 3s infinite'
            }}>
              {/* Ancient rune border effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 20% 20%, rgba(199, 156, 78, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(199, 156, 78, 0.1) 0%, transparent 50%)
                `,
                pointerEvents: 'none'
              }} />
              
              <span style={{
                position: 'relative',
                zIndex: 2,
                background: 'linear-gradient(135deg, #e6d6b5, #c8aa6e, #b8943c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
              }}>
                {currentSpelling}
              </span>
            </div>
          )}
          
          {/* Ad Placeholder */}
          <AdPlaceholder />
          
        </div>
        
        {/* Right Side - Chat Interface */}
        <ChatInterface 
          gameMode={gameMode}
          messages={messages}
          onSendMessage={handleChatMessage}
          isTyping={isSpiritTyping || isAILoading || isSpelling}
          isSpelling={isSpelling}
          username={username}
        />
      </div>

      {/* Chat History Panel */}
      <ChatHistoryPanel
        chatHistory={chatHistory}
        sessionId={sessionId}
        onClearHistory={clearChatHistory}
        isVisible={showChatHistory}
        onToggleVisibility={() => setShowChatHistory(!showChatHistory)}
      />

      {/* Hidden Admin Trigger Hint */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: '10px',
        color: '#333',
        opacity: 0.1,
        cursor: 'default',
        userSelect: 'none'
      }}>
        Ctrl+Shift+A for Admin
      </div>
      
      {/* Footer with links */}
      {!gameMode && <Footer />}
    </main>
  )
}