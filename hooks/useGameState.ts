import { useState, useCallback } from 'react'
import { GameMode, Message, Spirit } from '@/app/components/types'

export function useGameState() {
  const [gameMode, setGameMode] = useState<GameMode>(null)
  const [activeSpirit, setActiveSpirit] = useState<Spirit | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'SYSTEM', text: 'The board is active. Ask your questions...', type: 'system' }
  ])

  const selectMode = useCallback((mode: GameMode) => {
    setGameMode(mode)
    
    if (mode === 'anonymous') {
      setMessages(prev => [...prev, 
        { sender: 'SYSTEM', text: 'You are now connected to the spirit world. A presence approaches...', type: 'system' }
      ])
    } else if (mode === 'friend') {
      setMessages(prev => [...prev,
        { sender: 'SYSTEM', text: 'Friend mode activated. Share the link with a friend to begin.', type: 'system' }
      ])
    }
  }, [])

  const addMessage = useCallback((sender: string, text: string, type: Message['type']) => {
    setMessages(prev => [...prev, { sender, text, type }])
  }, [])

  const resetGame = useCallback(() => {
    setGameMode(null)
    setActiveSpirit(null)
    setMessages([
      { sender: 'SYSTEM', text: 'The board is active. Ask your questions...', type: 'system' }
    ])
  }, [])

  return {
    gameMode,
    activeSpirit,
    messages,
    selectMode,
    addMessage,
    resetGame,
    setActiveSpirit
  }
}