import * as BABYLON from '@babylonjs/core'
import { useSceneStore } from '../hooks/useSceneStore'

export class CameraController {
  private camera: BABYLON.ArcRotateCamera
  private keysDown = new Set<string>()
  private keyHandler: ((e: KeyboardEvent) => void) | null = null
  private keyUpHandler: ((e: KeyboardEvent) => void) | null = null
  private nudgeHandler: ((e: Event) => void) | null = null
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
    this.camera.upperBetaLimit = 1.4
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

    // Custom event nudge (from on-screen nav buttons)
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

    // Per-frame keyboard processing
    this.renderObserver = scene.onBeforeRenderObservable.add(() => {
      if (!useSceneStore.getState().cameraInputEnabled) return
      if (this.keysDown.has('ArrowLeft')) this.camera.alpha -= 0.04
      if (this.keysDown.has('ArrowRight')) this.camera.alpha += 0.04
      if (this.keysDown.has('ArrowUp')) {
        const newRadius = this.camera.radius - 0.3
        this.camera.radius = Math.max(this.camera.lowerRadiusLimit ?? 0, newRadius)
      }
      if (this.keysDown.has('ArrowDown')) {
        const newRadius = this.camera.radius + 0.3
        this.camera.radius = Math.min(this.camera.upperRadiusLimit ?? Infinity, newRadius)
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
    }
  }

  getCamera(): BABYLON.ArcRotateCamera {
    return this.camera
  }

  dispose(): void {
    if (this.keyHandler) window.removeEventListener('keydown', this.keyHandler)
    if (this.keyUpHandler) window.removeEventListener('keyup', this.keyUpHandler)
    if (this.nudgeHandler) window.removeEventListener('camera:nudge', this.nudgeHandler)
    if (this.renderObserver) {
      this.camera.getScene().onBeforeRenderObservable.remove(this.renderObserver)
    }
  }
}
