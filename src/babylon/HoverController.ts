import * as BABYLON from '@babylonjs/core'
import { useSceneStore } from '../hooks/useSceneStore'
import { CameraController } from './CameraController'
import type { ProjectGallery } from './ProjectGallery'
import type { AboutMeDisc } from './AboutMeDisc'
import { spawnApple } from './TreeGenerator'

export class HoverController {
  private scene: BABYLON.Scene
  private cameraController: CameraController
  private gallery: ProjectGallery
  private aboutMeDisc: AboutMeDisc | null
  private observer: BABYLON.Nullable<BABYLON.Observer<BABYLON.PointerInfo>>
  private currentHoveredId: string | null = null
  private discHovered = false

  constructor(
    scene: BABYLON.Scene,
    cameraController: CameraController,
    gallery: ProjectGallery,
    aboutMeDisc: AboutMeDisc | null = null,
  ) {
    this.scene = scene
    this.cameraController = cameraController
    this.gallery = gallery
    this.aboutMeDisc = aboutMeDisc

    this.observer = scene.onPointerObservable.add((info) => {
      this.handlePointer(info)
    })

    // React to store changes: toggle camera input when panel opens/closes
    useSceneStore.subscribe((state) => {
      this.cameraController.setInputEnabled(state.cameraInputEnabled)
    })

    // Apply initial state (subscribe only fires on changes, not on mount)
    this.cameraController.setInputEnabled(
      useSceneStore.getState().cameraInputEnabled,
    )
  }

  private handlePointer(info: BABYLON.PointerInfo): void {
    const isTouch = (info.event as PointerEvent).pointerType === 'touch'

    if (info.type === BABYLON.PointerEventTypes.POINTERMOVE && !isTouch) {
      const pick = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
      )
      const id: string | null = pick?.pickedMesh?.metadata?.projectId ?? null
      this.updateHover(id)

      // Disc hover
      const isDiscHit = pick?.pickedMesh?.metadata?.aboutMeDisc === true
      if (isDiscHit !== this.discHovered) {
        this.discHovered = isDiscHit
        this.aboutMeDisc?.animateHover(isDiscHit)
      }
    }

    if (info.type === BABYLON.PointerEventTypes.POINTERTAP) {
      const pick = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
      )
      const id: string | null = pick?.pickedMesh?.metadata?.projectId ?? null

      if (id) {
        useSceneStore.getState().setSelectedProject(id)
      } else if (pick?.pickedMesh?.metadata?.aboutMeDisc === true) {
        useSceneStore.getState().setShowAboutMe(true)
      } else {
        // Check if a tree was tapped
        const treeMeta = pick?.pickedMesh?.metadata as {
          treeId?: string; treeTopY?: number
          foliageMinY?: number; foliageMaxY?: number; foliageRadius?: number
          treeX?: number; treeZ?: number
        } | null
        if (treeMeta?.treeId !== undefined && pick?.pickedMesh) {
          const pos = pick.pickedMesh.position
          const rx = (Math.random() * 2 - 1) * (treeMeta.foliageRadius ?? 1.5)
          const rz = (Math.random() * 2 - 1) * (treeMeta.foliageRadius ?? 1.5)
          const minY = treeMeta.foliageMinY ?? pos.y
          const maxY = treeMeta.foliageMaxY ?? (treeMeta.treeTopY ?? pos.y)
          const ry = minY + Math.random() * (maxY - minY)
          spawnApple(this.scene, (treeMeta.treeX ?? pos.x) + rx, ry, (treeMeta.treeZ ?? pos.z) + rz)
        } else {
          // Tapped empty space - close panel only if not dragging
          const state = useSceneStore.getState()
          if (state.selectedProjectId) {
            useSceneStore.getState().setSelectedProject(null)
          }
        }
      }
    }
  }

  private updateHover(id: string | null): void {
    if (id === this.currentHoveredId) return

    if (this.currentHoveredId) {
      this.gallery.getCard(this.currentHoveredId)?.animateHover(false)
    }

    if (id) {
      this.gallery.getCard(id)?.animateHover(true)
    }

    this.currentHoveredId = id
    useSceneStore.getState().setHoveredProject(id)
  }

  dispose(): void {
    if (this.observer) {
      this.scene.onPointerObservable.remove(this.observer)
    }
  }
}
