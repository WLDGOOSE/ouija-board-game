import { useState } from 'react'

interface AdminSettings {
  useAI: boolean
}

interface AdminPanelProps {
  onClose: () => void
  onSettingsChange: (settings: AdminSettings) => void
  currentSettings: AdminSettings
}

export default function AdminPanel({ onClose, onSettingsChange, currentSettings }: AdminPanelProps) {
  const [settings, setSettings] = useState<AdminSettings>(currentSettings)

  const handleSave = () => {
    onSettingsChange(settings)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
        maxWidth: '500px'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#e0e0e0' }}>Admin Panel</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e0e0e0' }}>
            <input
              type="checkbox"
              checked={settings.useAI}
              onChange={(e) => setSettings(prev => ({ ...prev, useAI: e.target.checked }))}
            />
            Enable AI Responses
          </label>
          <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
            Uses AI for more dynamic spirit responses (requires API key)
          </small>
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
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#5a0a5a',
              color: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}