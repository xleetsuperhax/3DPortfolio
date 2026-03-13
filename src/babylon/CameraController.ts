import * as BABYLON from '@babylonjs/core'
import { useSceneStore } from '../hooks/useSceneStore'

export class CameraController {
  private camera: BABYLON.ArcRotateCamera
  private keysDown = new Set<string>()
  private navActive = new Set<string>()
  private keyHandler: ((e: KeyboardEvent) => void) | null = null
  private keyUpHandler: ((e: KeyboardEvent) => void) | null = null
  private nudgeHandler: ((e: Event) => void) | null = null
  private navStartHandler: ((e: Event) => void) | null = null
  private navStopHandler: ((e: Event) => void) | null = null
  private renderObserver: BABYLON.Observer<BABYLON.Scene> | null = null

  constructor(scene: BABYLON.Scene, arcRadius: number) {
    this.camera = new BABYLON.ArcRotateCamera(
      'mainCamera',
      -Math.PI / 2,
      1.0,
      arcRadius * 1.1,
      BABYLON.Vector3.Zero(),
      scene,
    )

    this.camera.lowerBetaLimit = 0.4
    this.camera.upperBetaLimit = 1.6
    this.camera.lowerRadiusLimit = arcRadius * 0.5
    this.camera.upperRadiusLimit = arcRadius * 2.0
    this.camera.inertia = 0.5
    this.camera.wheelDeltaPercentage = 0.01
    this.camera.pinchDeltaPercentage = 0.001

    this.camera.attachControl(scene.getEngine().getRenderingCanvas()!, true)

    // Keyboard input — applied per-frame via render observable
    this.keyHandler = (e: KeyboardEvent) => {
      this.keysDown.add(e.key)
    }
    this.keyUpHandler = (e: KeyboardEvent) => {
      this.keysDown.delete(e.key)
    }
    window.addEventListener('keydown', this.keyHandler)
    window.addEventListener('keyup', this.keyUpHandler)

    // Custom event nudge (for one-shot external nudges)
    this.nudgeHandler = (e: Event) => {
      if (!useSceneStore.getState().cameraInputEnabled) return
      const detail = (e as CustomEvent).detail as { alpha?: number; zoom?: number }
      if (detail.alpha !== undefined) {
        this.camera.alpha += detail.alpha
      }
      if (detail.zoom !== undefined) {
        const newRadius = this.camera.radius + detail.zoom
        this.camera.radius = Math.max(
          this.camera.lowerRadiusLimit ?? 0,
          Math.min(this.camera.upperRadiusLimit ?? Infinity, newRadius),
        )
      }
    }
    window.addEventListener('camera:nudge', this.nudgeHandler)

    // Nav button start/stop events (from on-screen nav buttons)
    this.navStartHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { direction: string }
      this.navActive.add(detail.direction)
    }
    this.navStopHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { direction: string }
      this.navActive.delete(detail.direction)
    }
    window.addEventListener('camera:navStart', this.navStartHandler)
    window.addEventListener('camera:navStop', this.navStopHandler)

    // Per-frame keyboard + nav button processing
    this.renderObserver = scene.onBeforeRenderObservable.add(() => {
      if (!useSceneStore.getState().cameraInputEnabled) return

      const lower = this.camera.lowerRadiusLimit ?? 0
      const upper = this.camera.upperRadiusLimit ?? Infinity

      // Arrow key input
      if (this.keysDown.has('ArrowLeft')) this.camera.alpha -= 0.04
      if (this.keysDown.has('ArrowRight')) this.camera.alpha += 0.04
      if (this.keysDown.has('ArrowUp')) {
        this.camera.radius = Math.max(lower, this.camera.radius - 0.3)
      }
      if (this.keysDown.has('ArrowDown')) {
        this.camera.radius = Math.min(upper, this.camera.radius + 0.3)
      }

      // Nav button hold input (smooth, frame-rate consistent)
      if (this.navActive.has('rotateLeft')) this.camera.alpha -= 0.015
      if (this.navActive.has('rotateRight')) this.camera.alpha += 0.015
      if (this.navActive.has('zoomIn')) {
        this.camera.radius = Math.max(lower, this.camera.radius - 0.12)
      }
      if (this.navActive.has('zoomOut')) {
        this.camera.radius = Math.min(upper, this.camera.radius + 0.12)
      }
      if (this.navActive.has('panUp')) {
        this.camera.target.y = Math.min(4.0, this.camera.target.y + 0.04)
      }
      if (this.navActive.has('panDown')) {
        this.camera.target.y = Math.max(-2.0, this.camera.target.y - 0.04)
      }
      const panSpeed = 0.04
      if (this.navActive.has('panLeft')) {
        this.camera.target.x += Math.sin(this.camera.alpha) * panSpeed
        this.camera.target.z -= Math.cos(this.camera.alpha) * panSpeed
      }
      if (this.navActive.has('panRight')) {
        this.camera.target.x -= Math.sin(this.camera.alpha) * panSpeed
        this.camera.target.z += Math.cos(this.camera.alpha) * panSpeed
      }
    })
  }

  setInputEnabled(enabled: boolean): void {
    if (enabled) {
      this.camera.attachControl(
        this.camera.getScene().getEngine().getRenderingCanvas()!,
        true,
      )
    } else {
      this.camera.detachControl()
      // Clear any held nav states when input is disabled
      this.navActive.clear()
    }
  }

  getCamera(): BABYLON.ArcRotateCamera {
    return this.camera
  }

  dispose(): void {
    if (this.keyHandler) window.removeEventListener('keydown', this.keyHandler)
    if (this.keyUpHandler) window.removeEventListener('keyup', this.keyUpHandler)
    if (this.nudgeHandler) window.removeEventListener('camera:nudge', this.nudgeHandler)
    if (this.navStartHandler) window.removeEventListener('camera:navStart', this.navStartHandler)
    if (this.navStopHandler) window.removeEventListener('camera:navStop', this.navStopHandler)
    if (this.renderObserver) {
      this.camera.getScene().onBeforeRenderObservable.remove(this.renderObserver)
    }
  }
}
