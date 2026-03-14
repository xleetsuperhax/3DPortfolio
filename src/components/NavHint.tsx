import { useEffect, useState } from 'react'
import { useSceneStore } from '../hooks/useSceneStore'

export function NavHint() {
  const [visible, setVisible] = useState(true)
  const hoveredId = useSceneStore((s) => s.hoveredProjectId)
  const selectedId = useSceneStore((s) => s.selectedProjectId)

  // Fade out after first hover interaction
  useEffect(() => {
    if (hoveredId || selectedId) {
      setVisible(false)
    }
  }, [hoveredId, selectedId])

  const isTouchDevice =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none)').matches

  return (
    <div
      style={{
        position: 'fixed',
        top: isTouchDevice ? 16 : 'auto',
        bottom: isTouchDevice ? 'auto' : 32,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.35)',
        fontSize: '13px',
        letterSpacing: '0.06em',
        pointerEvents: 'none',
        transition: 'opacity 0.6s ease',
        opacity: visible ? 1 : 0,
        userSelect: 'none',
      }}
    >
      {isTouchDevice ? 'drag to explore · tap a card' : 'drag to explore · click a card'}
    </div>
  )
}
