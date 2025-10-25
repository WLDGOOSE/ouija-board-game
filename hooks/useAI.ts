import { useState, useCallback, useEffect } from 'react'
import { SessionStorage, ChatMessage, ChatSession } from '@/lib/sessionStorage'

export function useAI() {
  const [isAILoading, setIsAILoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  // Initialize session on mount
  useEffect(() => {
    const initSession = () => {
      try {
        // Clean up expired sessions first
        SessionStorage.cleanupExpiredSessions()
        
        // Get or create session
        const currentSessionId = SessionStorage.getOrCreateSession()
        setSessionId(currentSessionId)
        
        // Load existing chat history
        const session = SessionStorage.getSession(currentSessionId)
        if (session?.messages) {
          setChatHistory(session.messages)
        }
      } catch (error) {
        console.warn('Failed to initialize chat session:', error)
        // Fallback: create new session without persistence
        const fallbackId = `fallback_${Date.now()}`
        setSessionId(fallbackId)
      }
    }

    initSession()
  }, [])

  const addMessageToHistory = useCallback((message: ChatMessage) => {
    setChatHistory(prev => {
      const updated = [...prev, message]
      
      // Save to session storage if we have a valid session
      if (sessionId) {
        try {
          SessionStorage.addMessage(sessionId, message)
        } catch (error) {
          console.warn('Failed to persist message:', error)
        }
      }
      
      return updated
    })
  }, [sessionId])

  const clearChatHistory = useCallback(() => {
    setChatHistory([])
    if (sessionId) {
      try {
        SessionStorage.clearSession(sessionId)
        // Create new session
        const newSessionId = SessionStorage.createNewSession()
        setSessionId(newSessionId)
      } catch (error) {
        console.warn('Failed to clear session:', error)
      }
    }
  }, [sessionId])

  const updatePersona = useCallback((persona: string) => {
    if (sessionId) {
      try {
        SessionStorage.updateSessionPersona(sessionId, persona)
      } catch (error) {
        console.warn('Failed to update persona:', error)
      }
    }
  }, [sessionId])

  const generateAIResponse = useCallback(async (
    prompt: string,
    options?: {
      persona?: string,
      history?: { role: 'user' | 'assistant'; content: string }[]
    }
  ): Promise<string> => {
    setIsAILoading(true)
    
    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: prompt,
        timestamp: Date.now()
      }
      addMessageToHistory(userMessage)

      // Use provided history or current chat history
      const historyToSend = options?.history || chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Update persona if provided
      if (options?.persona && sessionId) {
        updatePersona(options.persona)
      }

      // Call server-side AI endpoint for real responses
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          persona: options?.persona, 
          history: historyToSend 
        })
      })

      let aiResponse: string

      if (res.ok) {
        const data = await res.json()
        if (data?.text && typeof data.text === 'string') {
          aiResponse = data.text
        } else {
          throw new Error('Invalid response format')
        }
      } else {
        try {
          const err = await res.json()
          if (err?.error) {
            console.error('AI endpoint error:', err)
          }
        } catch {}
        throw new Error('API request failed')
      }

      // Add AI response to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      }
      addMessageToHistory(assistantMessage)

      return aiResponse
      
    } catch (error) {
      console.error('AI generation error:', error)
      
      // Fallback: simulated response if server fails
      await new Promise(resolve => setTimeout(resolve, 800))
      const defaultResponses = [
        "The spirits are listening... but some answers must be earned.",
        "I sense uncertainty in your path. Look within for guidance.",
        "The future is a tapestry still being woven.",
        "Some questions create ripples across multiple lifetimes.",
        "The answer you seek lies between what is and what could be.",
        "The veil reveals only what you are ready to understand.",
        "Your destiny is written in starlight and shadow.",
        "The ancient ones whisper of changes coming.",
        "Some mysteries are meant to remain mysteries.",
        "The path is unclear, but your intuition will guide you."
      ]
      const base = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
      const fallbackResponse = `${base} What would you ask next?`
      
      // Add fallback response to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: Date.now()
      }
      addMessageToHistory(assistantMessage)
      
      return fallbackResponse
    } finally {
      setIsAILoading(false)
    }
  }, [chatHistory, sessionId, addMessageToHistory, updatePersona])

  return {
    generateAIResponse,
    isAILoading,
    chatHistory,
    clearChatHistory,
    sessionId
  }
}