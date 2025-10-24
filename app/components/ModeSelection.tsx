import { ModeSelectionProps } from './types'
import Link from 'next/link'

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
      <div className="mt-28 text-center">
  <Link
    href="/about"
    className="text-white hover:text-gray-200 underline transition-colors duration-200"
  >
    About this Spirit Board
  </Link>
</div>

    </div>
  )
}