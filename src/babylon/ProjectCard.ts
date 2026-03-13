import * as BABYLON from '@babylonjs/core'
import { ProjectConfig } from '../types'
import { createCardBackMaterial, createAccentMaterial } from './materials'

const CARD_W = 3.2
const CARD_H = 2.0
const BORDER_PAD = 0.1
const TEX_W = 640
const TEX_H = 400

export class ProjectCard {
  readonly root: BABYLON.TransformNode
  private scene: BABYLON.Scene
  private faceMesh: BABYLON.Mesh
  private isHovered = false
  private animating = false

  constructor(scene: BABYLON.Scene, project: ProjectConfig) {
    this.scene = scene
    this.root = new BABYLON.TransformNode(`card_root_${project.id}`, scene)

    if (project.featured) {
      this.root.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2)
    }

    const accent = project.accentColor ?? '#4a90e2'

    // With rotation atan2(x,z), local -Z points toward the camera.
    // Negative z offsets displace layers toward the camera (closer = renders on top).
    // Border plane (slightly larger, accent color, furthest from camera of front layers)
    const border = BABYLON.MeshBuilder.CreatePlane(
      `card_border_${project.id}`,
      { width: CARD_W + BORDER_PAD * 2, height: CARD_H + BORDER_PAD * 2 },
      scene,
    )
    border.parent = this.root
    border.isPickable = false
    border.position.z = -0.005
    border.material = createAccentMaterial(scene, accent, project.id)

    // Background plane
    const bg = BABYLON.MeshBuilder.CreatePlane(
      `card_bg_${project.id}`,
      { width: CARD_W, height: CARD_H },
      scene,
    )
    bg.parent = this.root
    bg.isPickable = false
    bg.position.z = -0.01
    bg.material = createCardBackMaterial(scene, `bg_${project.id}`)

    // Content plane with DynamicTexture (closest to camera = renders on top)
    this.faceMesh = BABYLON.MeshBuilder.CreatePlane(
      `card_face_${project.id}`,
      { width: CARD_W, height: CARD_H },
      scene,
    )
    this.faceMesh.parent = this.root
    this.faceMesh.position.z = -0.02
    this.faceMesh.metadata = { projectId: project.id }

    const texture = new BABYLON.DynamicTexture(
      `tex_${project.id}`,
      { width: TEX_W, height: TEX_H },
      scene,
      true,
    )
    // Mark as opaque — prevents alpha-blending artifacts from canvas transparency
    texture.hasAlpha = false
    this.drawContent(texture, project, accent)

    // BabylonJS emissive formula: emissiveColor += texture * level  (additive)
    // So: Black(default) + texture = texture — we get the canvas content at full
    // brightness, unlit, with no other contribution.
    const faceMat = new BABYLON.StandardMaterial(`facemat_${project.id}`, scene)
    faceMat.emissiveTexture = texture
    // emissiveColor intentionally left at default Black so we get: 0 + texture = texture
    faceMat.diffuseColor = BABYLON.Color3.Black()
    faceMat.specularColor = BABYLON.Color3.Black()
    faceMat.disableLighting = true
    this.faceMesh.material = faceMat

    // Back face (dark, no content)
    const back = BABYLON.MeshBuilder.CreatePlane(
      `card_back_${project.id}`,
      { width: CARD_W, height: CARD_H },
      scene,
    )
    back.parent = this.root
    back.rotation.y = Math.PI
    back.position.z = 0.01
    back.isPickable = false
    back.material = createCardBackMaterial(scene, `back_${project.id}`)
  }

  private drawContent(
    texture: BABYLON.DynamicTexture,
    project: ProjectConfig,
    accent: string,
  ): void {
    const ctx = texture.getContext() as CanvasRenderingContext2D

    // Card background (slightly elevated so it's visible against scene)
    ctx.fillStyle = '#111130'
    ctx.fillRect(0, 0, TEX_W, TEX_H)

    // Header accent bar
    ctx.fillStyle = accent
    ctx.fillRect(0, 0, TEX_W, 6)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif'
    ctx.fillText(project.title, 28, 80)

    // Year
    ctx.fillStyle = '#888899'
    ctx.font = '26px system-ui, -apple-system, sans-serif'
    ctx.fillText(String(project.year), 28, 118)

    // Description (word-wrap at 2 lines)
    ctx.fillStyle = '#aaaacc'
    ctx.font = '24px system-ui, -apple-system, sans-serif'
    const maxWidth = TEX_W - 56
    const words = project.description.split(' ')
    let line = ''
    let y = 164
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, 28, y)
        line = word
        y += 26
        if (y > 250) {
          ctx.fillText(line + '…', 28, y)
          line = ''
          break
        }
      } else {
        line = test
      }
    }
    if (line) ctx.fillText(line, 28, y)

    // Tech tags
    ctx.font = '18px system-ui, -apple-system, sans-serif'
    let tagX = 28
    const tagY = TEX_H - 52
    for (const tag of project.tech.slice(0, 5)) {
      const tw = ctx.measureText(tag).width + 20
      if (tagX + tw > TEX_W - 28) break
      this.drawPill(ctx, tagX, tagY, tw, 24, accent)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(tag, tagX + 10, tagY + 19)
      tagX += tw + 8
    }

    texture.update()
  }

  private drawPill(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
  ): void {
    ctx.fillStyle = color + '44'
    ctx.strokeStyle = color + 'aa'
    ctx.lineWidth = 1
    const r = h / 2
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2)
    ctx.lineTo(x + r, y + h)
    ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  animateHover(enter: boolean): void {
    if (this.isHovered === enter || this.animating) return
    this.isHovered = enter
    this.animating = true

    const meta = this.root.metadata as { basescale: number; origPos: BABYLON.Vector3 }
    const base = meta?.basescale ?? 1
    const origPos = meta?.origPos ?? this.root.position.clone()

    // Move outward from origin (toward camera) on hover
    const dir = origPos.normalizeToNew()
    const offset = enter ? 0.4 : 0
    const targetPos = origPos.add(dir.scale(offset))
    const targetScale = enter ? 1.05 : 1

    const ease = new BABYLON.QuinticEase()
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)

    const posAnim = new BABYLON.Animation(
      'hoverPosAnim',
      'position',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    posAnim.setKeys([
      { frame: 0, value: this.root.position.clone() },
      { frame: 10, value: targetPos },
    ])
    posAnim.setEasingFunction(ease)

    const scaleAnim = new BABYLON.Animation(
      'hoverScaleAnim',
      'scaling',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    scaleAnim.setKeys([
      { frame: 0, value: this.root.scaling.clone() },
      { frame: 10, value: new BABYLON.Vector3(base * targetScale, base * targetScale, base * targetScale) },
    ])
    scaleAnim.setEasingFunction(ease)

    this.scene.beginDirectAnimation(
      this.root,
      [posAnim, scaleAnim],
      0,
      10,
      false,
      1,
      () => { this.animating = false },
    )
  }

  setRotationToFaceOrigin(position: BABYLON.Vector3): void {
    // BabylonJS CreatePlane front face is on the LOCAL -Z side.
    // To make it face the origin: rotate so local -Z points toward origin.
    // local -Z in world after rotation.y=θ is (-sinθ, 0, -cosθ).
    // Set equal to -normalize(position): sinθ = x/r, cosθ = z/r → θ = atan2(x, z)
    const angle = Math.atan2(position.x, position.z)
    this.root.rotation.y = angle
    this.root.metadata = {
      basescale: this.root.scaling.x,
      origPos: position.clone(),
    }
  }

  dispose(): void {
    this.root.dispose()
  }
}
