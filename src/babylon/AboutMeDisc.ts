import * as BABYLON from '@babylonjs/core'
import aboutConfig from '../config/about'

// Disc position on the floor — placed near the camera's initial position so it's
// immediately visible when the scene loads.
// Camera starts at approximately (0, 2.38, -3.70). Floor is at y = -1.5.
// The disc sits just above the floor at z = -3.0 (between camera and gallery).
const DISC_X = 0
const DISC_Y = -1.46  // slightly above floor (y = -1.5) to avoid z-fighting
const DISC_Z = 0

const DISC_DIAMETER = 1.6
const DISC_HEIGHT = 0.05
const GLOW_DIAMETER = 1.78
const GLOW_HEIGHT = 0.02

const TEX_SIZE = 512

export class AboutMeDisc {
  private scene: BABYLON.Scene
  private root: BABYLON.TransformNode
  private faceMesh: BABYLON.Mesh
  private glowMesh: BABYLON.Mesh
  private isHovered = false
  private animating = false

  constructor(scene: BABYLON.Scene) {
    this.scene = scene
    this.root = new BABYLON.TransformNode('about_me_disc_root', scene)
    this.root.position = new BABYLON.Vector3(DISC_X, DISC_Y, DISC_Z)

    const accent = aboutConfig.accentColor

    // ── Glow ring — slightly larger, slightly lower, accent material ──────────
    this.glowMesh = BABYLON.MeshBuilder.CreateCylinder(
      'about_me_disc_glow',
      { diameter: GLOW_DIAMETER, height: GLOW_HEIGHT, tessellation: 48 },
      scene,
    )
    this.glowMesh.parent = this.root
    this.glowMesh.position.y = -0.015
    this.glowMesh.isPickable = false

    const glowMat = new BABYLON.StandardMaterial('about_me_glow_mat', scene)
    glowMat.emissiveColor = BABYLON.Color3.FromHexString(accent)
    glowMat.disableLighting = true
    this.glowMesh.material = glowMat

    // ── Face disc — DynamicTexture drawn on the top ───────────────────────────
    this.faceMesh = BABYLON.MeshBuilder.CreateCylinder(
      'about_me_disc_face',
      { diameter: DISC_DIAMETER, height: DISC_HEIGHT, tessellation: 48 },
      scene,
    )
    this.faceMesh.parent = this.root
    this.faceMesh.metadata = { aboutMeDisc: true }

    const texture = new BABYLON.DynamicTexture(
      'about_me_disc_tex',
      { width: TEX_SIZE, height: TEX_SIZE },
      scene,
      true,
    )
    texture.hasAlpha = false
    this.drawTexture(texture, accent)

    const faceMat = new BABYLON.StandardMaterial('about_me_disc_mat', scene)
    faceMat.emissiveTexture = texture
    faceMat.diffuseColor = BABYLON.Color3.Black()
    faceMat.specularColor = BABYLON.Color3.Black()
    faceMat.disableLighting = true
    this.faceMesh.material = faceMat

    // Side material — dark so only the top is prominent
    const sideMat = new BABYLON.StandardMaterial('about_me_disc_side_mat', scene)
    sideMat.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.1)
    sideMat.disableLighting = true

    // BabylonJS cylinder: subMesh 0 = top, 1 = bottom, 2 = side
    // Apply the textured material to the top face and a dark material to the rest
    // by overriding the multi-material approach via a custom material per sub-mesh.
    // Simpler: just use a single emissive texture on all faces — the side is thin
    // enough (0.05 units) to be nearly invisible.
  }

  private drawTexture(texture: BABYLON.DynamicTexture, accent: string): void {
    const ctx = texture.getContext() as CanvasRenderingContext2D
    const cx = TEX_SIZE / 2
    const cy = TEX_SIZE / 2
    const r = TEX_SIZE / 2

    // ── Background circle ─────────────────────────────────────────────────────
    ctx.fillStyle = '#0d0d1a'
    ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE)

    // Clip everything to a circle so corners are transparent
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()

    // Inner dark fill
    ctx.fillStyle = '#111130'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()

    // ── Outer accent ring ─────────────────────────────────────────────────────
    ctx.strokeStyle = accent + 'cc'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(cx, cy, r - 10, 0, Math.PI * 2)
    ctx.stroke()

    // ── Inner concentric ring (decorative) ────────────────────────────────────
    ctx.strokeStyle = accent + '33'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, r - 40, 0, Math.PI * 2)
    ctx.stroke()

    // ── Main label ────────────────────────────────────────────────────────────
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 62px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('about me', cx, cy - 18)

    // ── Subtle hint ───────────────────────────────────────────────────────────
    ctx.fillStyle = '#6b7280'
    ctx.font = '22px system-ui, -apple-system, sans-serif'
    ctx.fillText('click to open', cx, cy + 36)

    ctx.restore()
    texture.update()
  }

  /** The glow mesh to whitelist in the scene's GlowLayer. */
  getGlowMesh(): BABYLON.Mesh {
    return this.glowMesh
  }

  /** The face mesh that is pickable (carries aboutMeDisc metadata). */
  getFaceMesh(): BABYLON.Mesh {
    return this.faceMesh
  }

  animateHover(enter: boolean): void {
    if (this.isHovered === enter || this.animating) return
    this.isHovered = enter
    this.animating = true

    const targetScale = enter ? 1.12 : 1.0

    const ease = new BABYLON.QuinticEase()
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)

    const scaleAnim = new BABYLON.Animation(
      'discHoverScale',
      'scaling',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    scaleAnim.setKeys([
      { frame: 0, value: this.root.scaling.clone() },
      { frame: 10, value: new BABYLON.Vector3(targetScale, targetScale, targetScale) },
    ])
    scaleAnim.setEasingFunction(ease)

    this.scene.beginDirectAnimation(
      this.root,
      [scaleAnim],
      0,
      10,
      false,
      1,
      () => { this.animating = false },
    )
  }

  dispose(): void {
    this.root.dispose()
  }
}
