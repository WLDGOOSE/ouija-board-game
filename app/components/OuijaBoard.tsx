'use client'

import { useRef, useEffect } from 'react'
import MysticRing from './MysticRing'
import { OuijaBoardProps } from './types'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

export default function OuijaBoard({ 
  gameMode, 
  onInteraction, 
  planchettePosition, 
  messages,
  isSpelling,
  currentSpelling,
  currentLetter
}: OuijaBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)

  const handleLetterClick = (letter: string) => {
    if (!gameMode || isSpelling) return
    onInteraction({ type: 'letter', value: letter })
  }

  const handleYesNo = (response: 'YES' | 'NO') => {
    if (!gameMode || isSpelling) return
    onInteraction({ type: 'yesno', value: response })
  }

  const handleGoodbye = () => {
    if (!gameMode || isSpelling) return
    onInteraction({ type: 'goodbye', value: 'GOODBYE' })
  }

  // Create floating particles
  useEffect(() => {
    if (!boardRef.current) return

    const board = boardRef.current
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      
      const x = Math.random() * 600
      const y = Math.random() * 450
      const tx = Math.random() * 100 - 50
      const ty = Math.random() * 100 - 50
      
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.setProperty('--tx', `${tx}px`)
      particle.style.setProperty('--ty', `${ty}px`)
      particle.style.animationDuration = `${10 + Math.random() * 20}s`
      particle.style.animationDelay = `${Math.random() * 5}s`
      
      board.appendChild(particle)
    }

    return () => {
      const particles = board.querySelectorAll('.particle')
      particles.forEach(particle => particle.remove())
    }
  }, [])

  return (
    <div className="board-container">
      <div className="board" ref={boardRef}>
        <h2 className="board-title">SPIRIT BOARD</h2>
        
        {/* Current spelling overlay */}
        {isSpelling && currentSpelling && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#c8aa6e',
            padding: '15px 25px',
            borderRadius: '8px',
            fontSize: '20px',
            fontWeight: 'bold',
            zIndex: 5,
            border: '2px solid #8b7355',
            textShadow: '0 0 10px rgba(199, 156, 78, 0.8)',
            fontFamily: 'Cinzel, serif',
            background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.9), rgba(20, 20, 20, 0.95))'
          }}>
            {currentSpelling}
          </div>
        )}
        
        <div className="letters-grid">
          {LETTERS.map((letter, index) => (
            <div
              key={index}
              className="letter"
              onClick={() => handleLetterClick(letter)}
              style={{
                opacity: isSpelling ? 0.6 : 1,
                cursor: isSpelling ? 'not-allowed' : 'pointer'
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        
        <div className="yes-no">
          <div 
            className="yes" 
            onClick={() => handleYesNo('YES')}
            style={{
              opacity: isSpelling ? 0.6 : 1,
              cursor: isSpelling ? 'not-allowed' : 'pointer'
            }}
          >
            YES
          </div>
          <div 
            className="no" 
            onClick={() => handleYesNo('NO')}
            style={{
              opacity: isSpelling ? 0.6 : 1,
              cursor: isSpelling ? 'not-allowed' : 'pointer'
            }}
          >
            NO
          </div>
        </div>
        
        <div 
          className="goodbye" 
          onClick={handleGoodbye}
          style={{
            opacity: isSpelling ? 0.6 : 1,
            cursor: isSpelling ? 'not-allowed' : 'pointer'
          }}
        >
          GOODBYE
        </div>
        
        {/* Replace Planchette with Mystic Ring */}
        <MysticRing 
          position={planchettePosition} 
          isActive={isSpelling}
          currentLetter={currentLetter}
        />
        
        {/* Candles for atmosphere */}
        <div className="candle" style={{ top: '20px', left: '30px' }} />
        <div className="candle" style={{ top: '20px', right: '30px' }} />
        <div className="candle" style={{ bottom: '20px', left: '30px' }} />
        <div className="candle" style={{ bottom: '20px', right: '30px' }} />
      </div>
    </div>
  )
}