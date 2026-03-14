import * as BABYLON from '@babylonjs/core'
import { AppConfig } from '../types'
import { ProjectCard } from './ProjectCard'

export class ProjectGallery {
  private cards: ProjectCard[] = []

  constructor(scene: BABYLON.Scene, config: AppConfig) {
    const { projects, gallery } = config
    const { layout, arcRadius, cardSpacing } = gallery

    if (layout === 'arc') {
      this.buildArc(scene, projects, arcRadius, cardSpacing)
    } else if (layout === 'grid') {
      this.buildGrid(scene, projects, cardSpacing)
    } else {
      this.buildScatter(scene, projects, arcRadius)
    }
  }

  private buildArc(
    scene: BABYLON.Scene,
    projects: AppConfig['projects'],
    radius: number,
    _spacing: number,
  ): void {
    const count = projects.length
    // Keep all cards in the front hemisphere (|angle| < 90°) so their
    // faces are visible from the camera at negative-Z. Cap span at ~153°
    // so even with many cards they never wrap to the near side.
    const arcSpan = Math.min(Math.PI * 0.85, (count - 1) * (Math.PI / 3))
    const angleStep = count > 1 ? arcSpan / (count - 1) : 0
    const startAngle = -(arcSpan / 2)

    for (let i = 0; i < count; i++) {
      const card = new ProjectCard(scene, projects[i])
      const angle = count === 1 ? 0 : startAngle + i * angleStep
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius

      card.root.position = new BABYLON.Vector3(x, 0, z)
      card.setRotationToFaceOrigin(card.root.position)
      this.cards.push(card)
    }
  }

  private buildGrid(
    scene: BABYLON.Scene,
    projects: AppConfig['projects'],
    spacing: number,
  ): void {
    const cols = Math.ceil(Math.sqrt(projects.length))
    for (let i = 0; i < projects.length; i++) {
      const card = new ProjectCard(scene, projects[i])
      const col = i % cols
      const row = Math.floor(i / cols)
      card.root.position = new BABYLON.Vector3(
        (col - (cols - 1) / 2) * (spacing + 2.4),
        0,
        -row * (spacing + 1.5),
      )
      this.cards.push(card)
    }
  }

  private buildScatter(
    scene: BABYLON.Scene,
    projects: AppConfig['projects'],
    radius: number,
  ): void {
    // Deterministic scatter using project index as seed
    for (let i = 0; i < projects.length; i++) {
      const card = new ProjectCard(scene, projects[i])
      const angle = (i / projects.length) * Math.PI * 2 + i * 0.7
      const r = radius * (0.6 + (i % 3) * 0.2)
      card.root.position = new BABYLON.Vector3(
        Math.sin(angle) * r,
        (i % 3) * 0.5 - 0.5,
        Math.cos(angle) * r,
      )
      card.setRotationToFaceOrigin(card.root.position)
      this.cards.push(card)
    }
  }

  getCard(projectId: string): ProjectCard | undefined {
    return this.cards.find(
      (c) => c.root.name === `card_root_${projectId}`,
    )
  }

  dispose(): void {
    for (const card of this.cards) card.dispose()
    this.cards = []
  }
}
