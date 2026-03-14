import { useSceneStore } from '../hooks/useSceneStore'

function navStart(direction: string) {
  window.dispatchEvent(new CustomEvent('camera:navStart', { detail: { direction } }))
}

function navStop(direction: string) {
  window.dispatchEvent(new CustomEvent('camera:navStop', { detail: { direction } }))
}

interface NavButtonProps {
  label: string
  direction: string
}

function NavButton({ label, direction }: NavButtonProps) {
  return (
    <button
      onPointerDown={() => navStart(direction)}
      onPointerUp={() => navStop(direction)}
      onPointerLeave={() => navStop(direction)}
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
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    >
      {/* D-pad for panning */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        <NavButton label="↑" direction="panUp" />
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <NavButton label="←" direction="panLeft" />
          <div style={{ width: 48, height: 48 }} />
          <NavButton label="→" direction="panRight" />
        </div>
        <NavButton label="↓" direction="panDown" />
      </div>

      {/* Camera controls: rotate + zoom */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <NavButton label="↺" direction="rotateLeft" />
        <NavButton label="+" direction="zoomIn" />
        <NavButton label="−" direction="zoomOut" />
        <NavButton label="↻" direction="rotateRight" />
      </div>
    </div>
  )
}
