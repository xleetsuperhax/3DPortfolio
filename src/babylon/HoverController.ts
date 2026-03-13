import * as BABYLON from '@babylonjs/core'
import { useSceneStore } from '../hooks/useSceneStore'
import { CameraController } from './CameraController'
import type { ProjectGallery } from './ProjectGallery'
import { spawnApple } from './TreeGenerator'

export class HoverController {
  private scene: BABYLON.Scene
  private cameraController: CameraController
  private gallery: ProjectGallery
  private observer: BABYLON.Nullable<BABYLON.Observer<BABYLON.PointerInfo>>
  private currentHoveredId: string | null = null

  constructor(
    scene: BABYLON.Scene,
    cameraController: CameraController,
    gallery: ProjectGallery,
  ) {
    this.scene = scene
    this.cameraController = cameraController
    this.gallery = gallery

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
    }

    if (info.type === BABYLON.PointerEventTypes.POINTERTAP) {
      const pick = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
      )
      const id: string | null = pick?.pickedMesh?.metadata?.projectId ?? null

      if (id) {
        useSceneStore.getState().setSelectedProject(id)
      } else {
        // Check if a tree was tapped
        const treeMeta = pick?.pickedMesh?.metadata as { treeId?: string; treeTopY?: number } | null
        if (treeMeta?.treeId !== undefined && pick?.pickedMesh) {
          const pos = pick.pickedMesh.position
          spawnApple(this.scene, pos.x, treeMeta.treeTopY ?? pos.y, pos.z)
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
