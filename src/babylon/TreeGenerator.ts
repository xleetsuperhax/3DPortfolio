import * as BABYLON from '@babylonjs/core'

function makeTreeMaterial(scene: BABYLON.Scene, hexColor: string, id: string): BABYLON.StandardMaterial {
  const mat = new BABYLON.StandardMaterial(`tree_mat_${id}`, scene)
  mat.diffuseColor = BABYLON.Color3.Black()
  mat.emissiveColor = BABYLON.Color3.FromHexString(hexColor)
  mat.specularColor = BABYLON.Color3.Black()
  return mat
}

function placeTree(scene: BABYLON.Scene, x: number, z: number, scale: number, id: string): void {
  const groundY = -1.5

  // Trunk
  const trunk = BABYLON.MeshBuilder.CreateCylinder(
    `tree_trunk_${id}`,
    { height: 2.5 * scale, diameter: 0.5 * scale, tessellation: 6 },
    scene,
  )
  trunk.position = new BABYLON.Vector3(x, groundY + 1.25 * scale, z)
  trunk.material = makeTreeMaterial(scene, '#5a3219', `trunk_${id}`)
  trunk.isPickable = false

  // Lower foliage (wider)
  const foliageLow = BABYLON.MeshBuilder.CreateBox(
    `tree_foliage_low_${id}`,
    { width: 3 * scale, height: 2.5 * scale, depth: 3 * scale },
    scene,
  )
  foliageLow.position = new BABYLON.Vector3(x, groundY + 2.5 * scale + 1.25 * scale, z)
  foliageLow.material = makeTreeMaterial(scene, '#2d5a1b', `foliage_low_${id}`)
  foliageLow.isPickable = false

  // Upper foliage (narrower, slightly different green) — pickable for click detection
  const foliageHigh = BABYLON.MeshBuilder.CreateBox(
    `tree_foliage_high_${id}`,
    { width: 2 * scale, height: 2 * scale, depth: 2 * scale },
    scene,
  )
  foliageHigh.position = new BABYLON.Vector3(x, groundY + 2.5 * scale + 2.5 * scale + 1 * scale, z)
  foliageHigh.material = makeTreeMaterial(scene, '#3d7222', `foliage_high_${id}`)
  foliageHigh.isPickable = true
  foliageHigh.metadata = {
    treeId: id,
    treeTopY: foliageHigh.position.y + scale,
  }
}

// Deterministic tree positions — inner ring + outer ring
// arcRadius is the gallery radius; trees start beyond it
const TREE_DEFS: Array<{ angleFrac: number; radiusMult: number; scale: number }> = [
  // Inner ring (~radius 13-16)
  { angleFrac: 0.05, radiusMult: 2.2, scale: 1.0 },
  { angleFrac: 0.13, radiusMult: 2.0, scale: 0.85 },
  { angleFrac: 0.22, radiusMult: 2.3, scale: 1.1 },
  { angleFrac: 0.30, radiusMult: 2.1, scale: 0.9 },
  { angleFrac: 0.45, radiusMult: 2.4, scale: 1.0 },
  { angleFrac: 0.57, radiusMult: 2.0, scale: 0.8 },
  { angleFrac: 0.67, radiusMult: 2.2, scale: 1.05 },
  { angleFrac: 0.78, radiusMult: 2.1, scale: 0.95 },
  // Outer ring (~radius 22-32)
  { angleFrac: 0.08, radiusMult: 3.8, scale: 1.2 },
  { angleFrac: 0.20, radiusMult: 4.2, scale: 0.9 },
  { angleFrac: 0.35, radiusMult: 3.5, scale: 1.15 },
  { angleFrac: 0.50, radiusMult: 4.0, scale: 1.0 },
  { angleFrac: 0.62, radiusMult: 3.7, scale: 0.85 },
  { angleFrac: 0.74, radiusMult: 4.3, scale: 1.1 },
  { angleFrac: 0.88, radiusMult: 3.6, scale: 0.95 },
]

export function populateTrees(scene: BABYLON.Scene, arcRadius: number): void {
  for (let i = 0; i < TREE_DEFS.length; i++) {
    const def = TREE_DEFS[i]
    const angle = def.angleFrac * Math.PI * 2
    const radius = arcRadius * def.radiusMult
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    placeTree(scene, x, z, def.scale, String(i))
  }
}

export function spawnApple(scene: BABYLON.Scene, x: number, y: number, z: number): void {
  const size = 0.7
  const apple = BABYLON.MeshBuilder.CreatePlane(`apple_${Date.now()}_${Math.random()}`, { width: size, height: size }, scene)
  apple.position = new BABYLON.Vector3(x, y + 0.5, z)
  apple.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL

  // 16×16 pixel art apple texture
  const native = 16
  const tex = new BABYLON.DynamicTexture(`apple_tex_${Date.now()}`, { width: native, height: native }, scene, false)
  tex.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE)
  tex.hasAlpha = true

  const ctx = tex.getContext() as CanvasRenderingContext2D
  // Transparent background
  ctx.clearRect(0, 0, native, native)

  // Pixel colors
  const stem = '#5a3219'
  const leaf = '#3d7222'
  const red = '#cc2200'
  const highlight = '#ff6644'
  const shadow = '#880000'

  // Stem: (6,0), (6,1)
  ctx.fillStyle = stem
  ctx.fillRect(6, 0, 1, 2)

  // Leaf: (5,1)
  ctx.fillStyle = leaf
  ctx.fillRect(5, 1, 1, 1)

  // Apple body — roughly circular, centered around (5, 5)
  // Row 2: cols 3–7
  ctx.fillStyle = red
  ctx.fillRect(3, 2, 5, 1)
  // Row 3: cols 2–8
  ctx.fillRect(2, 3, 7, 1)
  // Row 4: cols 2–8
  ctx.fillRect(2, 4, 7, 1)
  // Row 5: cols 2–8
  ctx.fillRect(2, 5, 7, 1)
  // Row 6: cols 2–8
  ctx.fillRect(2, 6, 7, 1)
  // Row 7: cols 3–7
  ctx.fillRect(3, 7, 5, 1)

  // Highlight pixel
  ctx.fillStyle = highlight
  ctx.fillRect(3, 3, 1, 1)

  // Shadow pixel
  ctx.fillStyle = shadow
  ctx.fillRect(7, 6, 1, 1)

  tex.update()

  const mat = new BABYLON.StandardMaterial(`apple_mat_${Date.now()}`, scene)
  mat.diffuseTexture = tex
  mat.emissiveColor = BABYLON.Color3.White()
  mat.disableLighting = true
  mat.backFaceCulling = false

  apple.material = mat
  apple.isPickable = false

  // Float upward slightly over the lifetime
  const floatAnim = new BABYLON.Animation(
    'appleFloat',
    'position.y',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  )
  floatAnim.setKeys([
    { frame: 0, value: apple.position.y },
    { frame: 300, value: apple.position.y + 1.5 },
  ])
  apple.animations = [floatAnim]
  scene.beginAnimation(apple, 0, 300, false)

  // Despawn after 5 seconds
  setTimeout(() => {
    apple.dispose()
    tex.dispose()
    mat.dispose()
  }, 5000)
}
