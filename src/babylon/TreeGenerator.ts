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

  // Upper foliage (narrower, slightly different green)
  const foliageHigh = BABYLON.MeshBuilder.CreateBox(
    `tree_foliage_high_${id}`,
    { width: 2 * scale, height: 2 * scale, depth: 2 * scale },
    scene,
  )
  foliageHigh.position = new BABYLON.Vector3(x, groundY + 2.5 * scale + 2.5 * scale + 1 * scale, z)
  foliageHigh.material = makeTreeMaterial(scene, '#3d7222', `foliage_high_${id}`)
  foliageHigh.isPickable = false
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
