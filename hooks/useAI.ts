import { useState, useCallback } from 'react'

export function useAI() {
  const [isAILoading, setIsAILoading] = useState(false)

  const generateAIResponse = useCallback(async (prompt: string): Promise<string> => {
    setIsAILoading(true)
    
    try {
      // Call server-side AI endpoint for real responses
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (res.ok) {
        const data = await res.json()
        if (data?.text && typeof data.text === 'string') {
          return data.text
        }
      } else {
        try {
          const err = await res.json()
          if (err?.error) {
            console.error('AI endpoint error:', err)
          }
        } catch {}
      }

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
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
      
    } catch (error) {
      console.error('AI generation error:', error)
      return "The connection is unclear... try again."
    } finally {
      setIsAILoading(false)
    }
  }, [])

  return {
    generateAIResponse,
    isAILoading
  }
}