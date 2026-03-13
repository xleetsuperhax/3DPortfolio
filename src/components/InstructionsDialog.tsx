import { useSceneStore } from '../hooks/useSceneStore'

const CONTROLS = {
  mouse: [
    { icon: '⬡', label: 'Drag', action: 'orbit the scene' },
    { icon: '⊕', label: 'Scroll', action: 'zoom in / out' },
    { icon: '↗', label: 'Click a card', action: 'view project details' },
  ],
  touch: [
    { icon: '⬡', label: 'Drag', action: 'orbit the scene' },
    { icon: '⊕', label: 'Pinch', action: 'zoom in / out' },
    { icon: '↗', label: 'Tap a card', action: 'view project details' },
  ],
}

export function InstructionsDialog() {
  const showInstructions = useSceneStore((s) => s.showInstructions)
  const setShowInstructions = useSceneStore((s) => s.setShowInstructions)

  if (!showInstructions) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '32px',
          width: 'min(480px, 90vw)',
          color: '#e5e7eb',
          fontFamily: 'system-ui, sans-serif',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        <h2
          style={{
            margin: '0 0 8px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.3px',
          }}
        >
          How to Navigate
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: '14px', color: '#9ca3af' }}>
          Explore the 3D portfolio space using mouse or touch.
        </p>

        <div style={{ display: 'flex', gap: '24px' }}>
          {(['mouse', 'touch'] as const).map((mode) => (
            <div key={mode} style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  marginBottom: '12px',
                }}
              >
                {mode === 'mouse' ? 'Mouse' : 'Touch'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {CONTROLS[mode].map(({ label, action }) => (
                  <div
                    key={label}
                    style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
                  >
                    <span
                      style={{ fontSize: '13px', fontWeight: 600, color: '#d1d5db' }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowInstructions(false)}
          style={{
            marginTop: '32px',
            width: '100%',
            padding: '12px',
            background: '#6c63ff',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '-0.1px',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = '#7c74ff'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = '#6c63ff'
          }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}
