import { useRef } from 'react'
import { useSceneStore } from '../hooks/useSceneStore'

function nudge(alpha?: number, zoom?: number) {
  window.dispatchEvent(new CustomEvent('camera:nudge', { detail: { alpha, zoom } }))
}

interface NavButtonProps {
  label: string
  alpha?: number
  zoom?: number
}

function NavButton({ label, alpha, zoom }: NavButtonProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    nudge(alpha, zoom)
    intervalRef.current = setInterval(() => nudge(alpha, zoom), 50)
  }

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return (
    <button
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(0,0,0,0.45)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 20,
        fontFamily: 'monospace',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'background 0.1s',
      }}
      onPointerEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'
      }}
      onPointerOut={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.45)'
      }}
    >
      {label}
    </button>
  )
}

export function NavigationControls() {
  const selectedProjectId = useSceneStore((s) => s.selectedProjectId)
  const showInstructions = useSceneStore((s) => s.showInstructions)

  if (selectedProjectId || showInstructions) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    >
      <NavButton label="←" alpha={-0.05} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <NavButton label="+" zoom={-0.5} />
        <NavButton label="−" zoom={0.5} />
      </div>
      <NavButton label="→" alpha={0.05} />
    </div>
  )
}
