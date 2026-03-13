import { useState } from 'react'
import { useSceneStore } from '../hooks/useSceneStore'

export function InfoButton() {
  const setShowInstructions = useSceneStore((s) => s.setShowInstructions)
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => setShowInstructions(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Show controls"
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.15)',
        background: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        color: '#e5e7eb',
        fontSize: '16px',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        transition: 'background 0.15s',
        lineHeight: 1,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      ?
    </button>
  )
}
