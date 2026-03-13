import * as BABYLON from '@babylonjs/core'

export class CameraController {
  private camera: BABYLON.ArcRotateCamera

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
    this.camera.inertia = 0.85
    this.camera.wheelDeltaPercentage = 0.01
    this.camera.pinchDeltaPercentage = 0.001

    this.camera.attachControl(scene.getEngine().getRenderingCanvas()!, true)
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
}
