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
    foliageMinY: foliageLow.position.y - 1.25 * scale,
    foliageMaxY: foliageHigh.position.y + scale,
    foliageRadius: 1.5 * scale,
    treeX: x,
    treeZ: z,
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
  apple.position = new BABYLON.Vector3(x, y, z)
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

  // Fall downward with gravity-like acceleration
  const fallAnim = new BABYLON.Animation(
    'appleFall',
    'position.y',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  )
  const easing = new BABYLON.QuadraticEase()
  easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN)
  fallAnim.setEasingFunction(easing)
  fallAnim.setKeys([
    { frame: 0, value: apple.position.y },
    { frame: 100, value: -1.0 },
  ])
  apple.animations = [fallAnim]
  scene.beginAnimation(apple, 0, 100, false, 1, () => {
    // Roll a short distance after landing
    const rollAngle = Math.random() * Math.PI * 2
    const rollDist = 0.3 + Math.random() * 1.2
    const rollFrames = 70
    const rollEase = new BABYLON.QuadraticEase()
    rollEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)

    const rollX = new BABYLON.Animation(
      'appleRollX', 'position.x', 60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    rollX.setEasingFunction(rollEase)
    rollX.setKeys([
      { frame: 0, value: apple.position.x },
      { frame: rollFrames, value: apple.position.x + Math.cos(rollAngle) * rollDist },
    ])

    const rollZ = new BABYLON.Animation(
      'appleRollZ', 'position.z', 60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    rollZ.setEasingFunction(rollEase)
    rollZ.setKeys([
      { frame: 0, value: apple.position.z },
      { frame: rollFrames, value: apple.position.z + Math.sin(rollAngle) * rollDist },
    ])

    // Spin the sprite to visually match the rolling distance
    const spinRadians = rollDist / (size / 2)
    const rollSpin = new BABYLON.Animation(
      'appleRollSpin', 'rotation.z', 60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    rollSpin.setEasingFunction(rollEase)
    rollSpin.setKeys([
      { frame: 0, value: 0 },
      { frame: rollFrames, value: spinRadians },
    ])

    scene.beginDirectAnimation(apple, [rollX, rollZ, rollSpin], 0, rollFrames, false)
  })

  // Void consumption at 19s: pulse outward then spiral-implode to nothing
  setTimeout(() => {
    const voidEase = new BABYLON.QuadraticEase()
    voidEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN)

    // scaling.x: 1 → 1.3 (pulse) then 1.3 → 0 (collapse)
    const voidScaleX = new BABYLON.Animation(
      'appleVoidScaleX', 'scaling.x', 60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    voidScaleX.setEasingFunction(voidEase)
    voidScaleX.setKeys([
      { frame: 0,  value: 1.0 },
      { frame: 18, value: 1.3 },
      { frame: 60, value: 0.0 },
    ])

    // scaling.y: mirrors scaling.x
    const voidScaleY = new BABYLON.Animation(
      'appleVoidScaleY', 'scaling.y', 60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    voidScaleY.setEasingFunction(voidEase)
    voidScaleY.setKeys([
      { frame: 0,  value: 1.0 },
      { frame: 18, value: 1.3 },
      { frame: 60, value: 0.0 },
    ])

    // rotation.z: spirals ~1.5 turns as it collapses
    const voidSpin = new BABYLON.Animation(
      'appleVoidSpin', 'rotation.z', 60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    voidSpin.setEasingFunction(voidEase)
    voidSpin.setKeys([
      { frame: 0,  value: apple.rotation.z },
      { frame: 60, value: apple.rotation.z + Math.PI * 3 },
    ])

    scene.beginDirectAnimation(apple, [voidScaleX, voidScaleY, voidSpin], 0, 60, false, 1, () => {
      apple.dispose()
      tex.dispose()
      mat.dispose()
    })
  }, 19000)
}
