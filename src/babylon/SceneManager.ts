import * as BABYLON from '@babylonjs/core'
import { AppConfig } from '../types'
import { CameraController } from './CameraController'
import { ProjectGallery } from './ProjectGallery'
import { HoverController } from './HoverController'
import { AboutMeDisc } from './AboutMeDisc'
import { createPixelGrassMaterial, createSkyboxMaterial } from './materials'
import { populateTrees } from './TreeGenerator'

export class SceneManager {
  private engine: BABYLON.Engine
  private scene: BABYLON.Scene
  private cameraController: CameraController
  private hoverController: HoverController
  private gallery: ProjectGallery
  private aboutMeDisc: AboutMeDisc

  constructor(canvas: HTMLCanvasElement, config: AppConfig) {
    const isMobile = window.devicePixelRatio > 2

    this.engine = new BABYLON.Engine(canvas, true, {
      adaptToDeviceRatio: true,
    })

    if (isMobile) {
      this.engine.setHardwareScalingLevel(1.5)
    }

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

    // Lighting
    const hemi = new BABYLON.HemisphericLight(
      'hemi',
      new BABYLON.Vector3(0, 1, 0),
      this.scene,
    )
    hemi.intensity = 0.3

    const dir = new BABYLON.DirectionalLight(
      'dir',
      new BABYLON.Vector3(-1, -2, -1),
      this.scene,
    )
    dir.intensity = 0.7

    // Camera
    this.cameraController = new CameraController(
      this.scene,
      config.gallery.arcRadius,
    )

    // Skybox — large sphere with pixel art sky texture on the inside
    const skybox = BABYLON.MeshBuilder.CreateSphere(
      'skybox',
      { diameter: 900, segments: 8 },
      this.scene,
    )
    skybox.material = createSkyboxMaterial(this.scene)
    skybox.isPickable = false
    skybox.infiniteDistance = true

    // Floor — pixel art grass
    const floor = BABYLON.MeshBuilder.CreateGround(
      'floor',
      { width: 200, height: 200 },
      this.scene,
    )
    floor.material = createPixelGrassMaterial(this.scene)
    floor.position.y = -1.5
    floor.isPickable = false

    // Gallery
    this.gallery = new ProjectGallery(this.scene, config)

    // About Me disc — placed near camera spawn point
    this.aboutMeDisc = new AboutMeDisc(this.scene)

    // Trees
    populateTrees(this.scene, config.gallery.arcRadius)

    // Glow layer — whitelist only accent border meshes so face/bg/back never
    // interfere with the bloom pass (avoids customEmissiveColorSelector side-effects)
    const glow = new BABYLON.GlowLayer('glow', this.scene)
    glow.intensity = isMobile ? 0.1 : 0.2
    this.scene.meshes.forEach((mesh) => {
      if (mesh.name.startsWith('card_border_')) {
        glow.addIncludedOnlyMesh(mesh as BABYLON.Mesh)
      }
    })
    // Add the about me disc's glow ring to the whitelist
    glow.addIncludedOnlyMesh(this.aboutMeDisc.getGlowMesh())

    // Hover controller
    this.hoverController = new HoverController(
      this.scene,
      this.cameraController,
      this.gallery,
      this.aboutMeDisc,
    )

    // Render loop
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  resize(): void {
    this.engine.resize()
  }

  dispose(): void {
    this.cameraController.dispose()
    this.hoverController.dispose()
    this.gallery.dispose()
    this.aboutMeDisc.dispose()
    this.scene.dispose()
    this.engine.dispose()
  }
}
