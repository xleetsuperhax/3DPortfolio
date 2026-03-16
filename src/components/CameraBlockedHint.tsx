import { useEffect } from 'react'
import { useSceneStore } from '../hooks/useSceneStore'

export function CameraBlockedHint() {
  const visible = useSceneStore((s) => s.cameraBlockedHint)
  const setCameraBlockedHint = useSceneStore((s) => s.setCameraBlockedHint)

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setCameraBlockedHint(false), 2000)
    return () => clearTimeout(t)
  }, [visible, setCameraBlockedHint])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '13px',
        letterSpacing: '0.06em',
        pointerEvents: 'none',
        transition: 'opacity 0.4s ease',
        opacity: visible ? 1 : 0,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      close the dialog to navigate
    </div>
  )
}
