import { ModeSelectionProps } from './types'

export default function ModeSelection({ onModeSelect }: ModeSelectionProps) {
  return (
    <div className="mode-selection">
      <h2 className="mode-title">SPIRIT BOARD</h2>
      <div className="mode-options">
        <div 
          className="mode-option" 
          onClick={() => onModeSelect('anonymous')}
        >
          <h3>Anonymous Mode</h3>
          <p>Connect with unknown spirits</p>
        </div>
        <div 
          className="mode-option" 
          onClick={() => onModeSelect('friend')}
        >
          <h3>Friend Mode</h3>
          <p>Connect with a friend</p>
        </div>
      </div>
    </div>
  )
}