import { useEffect, useRef } from 'react'
import { SceneManager } from '../babylon/SceneManager'
import { AppConfig } from '../types'

interface Props {
  config: AppConfig
}

export function CanvasWrapper({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const managerRef = useRef<SceneManager | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const manager = new SceneManager(canvas, config)
    managerRef.current = manager
    manager.resize() // ensure canvas drawing buffer matches CSS layout dimensions

    const observer = new ResizeObserver(() => manager.resize())
    observer.observe(canvas)

    return () => {
      observer.disconnect()
      manager.dispose()
      managerRef.current = null
    }
    // config is intentionally excluded — scene is rebuilt only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        touchAction: 'none',
      }}
    />
  )
}
