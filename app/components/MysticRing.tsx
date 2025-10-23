import { MysticRingProps } from './types'

export default function MysticRing({ position, isActive, currentLetter }: MysticRingProps) {
  return (
    <div 
      className="mystic-ring"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '70px',
        height: '70px',
        transition: isActive ? 'all 0.3s ease-out' : 'all 0.5s ease-out',
        zIndex: 10,
        pointerEvents: 'none'
      }}
    >
      {/* Current Letter Display */}
      {currentLetter && isActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#f8d78c',
          textShadow: '0 0 10px #c8aa6e, 0 0 20px #c8aa6e',
          zIndex: 20,
          animation: 'letterPulse 0.5s infinite alternate'
        }}>
          {currentLetter}
        </div>
      )}
      
      {/* Outer Ring */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        border: '3px solid #c8aa6e',
        borderRadius: '50%',
        boxShadow: `
          0 0 20px rgba(199, 156, 78, 0.8),
          inset 0 0 20px rgba(199, 156, 78, 0.3)
        `,
        animation: 'ringRotate 4s linear infinite',
        background: 'radial-gradient(circle, transparent 60%, rgba(199, 156, 78, 0.1) 100%)'
      }} />
      
      {/* Inner Ring */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '40px',
        height: '40px',
        border: '2px solid #8b7355',
        borderRadius: '50%',
        boxShadow: 'inset 0 0 15px rgba(199, 156, 78, 0.5)',
        animation: 'ringRotateReverse 3s linear infinite'
      }} />
      
      {/* Glowing Center */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '10px',
        height: '10px',
        backgroundColor: '#c8aa6e',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: `
          0 0 20px #c8aa6e,
          0 0 40px rgba(199, 156, 78, 0.5)
        `,
        animation: isActive ? 'pulseCenter 1s infinite alternate' : 'none'
      }} />
      
      {/* Rune Symbols */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        animation: 'runeGlow 3s infinite alternate'
      }}>
        {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ'].map((rune, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              fontSize: '14px',
              color: '#c8aa6e',
              textShadow: '0 0 8px rgba(199, 156, 78, 0.8)',
              transform: `rotate(${index * 72}deg) translate(35px) rotate(-${index * 72}deg)`
            }}
          >
            {rune}
          </div>
        ))}
      </div>
      
      {/* Active State Effects */}
      {isActive && (
        <>
          {/* Energy Pulse */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            border: '2px solid transparent',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent, #c8aa6e, transparent)',
            animation: 'energyPulse 2s infinite',
            filter: 'blur(1px)'
          }} />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: '#c8aa6e',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translate(50px)`,
                animation: `floatAway 2s infinite ${i * 0.25}s`,
                boxShadow: '0 0 10px #c8aa6e'
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}