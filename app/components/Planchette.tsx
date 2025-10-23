import { PlanchetteProps } from './types'

export default function Planchette({ position, isMoving }: PlanchetteProps) {
  return (
    <div 
      className="planchette"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isMoving ? 'transform 0.3s ease-out' : 'transform 0.5s ease-out',
        boxShadow: isMoving ? '0 0 20px rgba(255, 0, 0, 0.7)' : '0 0 15px rgba(0, 0, 0, 0.7)'
      }}
    >
      {isMoving && (
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          width: '10px',
          height: '10px',
          backgroundColor: '#ff0000',
          borderRadius: '50%',
          animation: 'pulse 1s infinite'
        }} />
      )}
    </div>
  )
}