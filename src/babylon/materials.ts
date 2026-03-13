import * as BABYLON from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'

export function createFloorMaterial(scene: BABYLON.Scene): GridMaterial {
  const mat = new GridMaterial('floor', scene)
  mat.majorUnitFrequency = 5
  mat.minorUnitVisibility = 0.1
  mat.gridRatio = 1
  mat.mainColor = new BABYLON.Color3(0.04, 0.04, 0.07)
  mat.lineColor = new BABYLON.Color3(0.12, 0.12, 0.2)
  mat.opacity = 0.8
  mat.backFaceCulling = false
  return mat
}

export function createCardBackMaterial(scene: BABYLON.Scene, id: string): BABYLON.StandardMaterial {
  const mat = new BABYLON.StandardMaterial(`cardBack_${id}`, scene)
  mat.diffuseColor = new BABYLON.Color3(0.06, 0.06, 0.1)
  mat.specularColor = new BABYLON.Color3(0, 0, 0)
  mat.emissiveColor = new BABYLON.Color3(0.03, 0.03, 0.06)
  return mat
}

export function createAccentMaterial(
  scene: BABYLON.Scene,
  hexColor: string,
  id: string,
): BABYLON.StandardMaterial {
  const mat = new BABYLON.StandardMaterial(`accent_${id}`, scene)
  const color = BABYLON.Color3.FromHexString(hexColor)
  mat.diffuseColor = BABYLON.Color3.Black()
  mat.emissiveColor = color  // full emissive — always visible regardless of lighting
  mat.specularColor = BABYLON.Color3.Black()
  return mat
}
