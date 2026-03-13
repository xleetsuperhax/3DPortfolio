import * as BABYLON from '@babylonjs/core'

export function createPixelGrassMaterial(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  // Draw grass at 32x32 pixel art resolution
  const native = 32
  const texture = new BABYLON.DynamicTexture('grassTex', { width: native, height: native }, scene, false)
  texture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE
  texture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE
  // Nearest-neighbor filtering for crisp pixel art
  texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE)

  const ctx = texture.getContext() as CanvasRenderingContext2D

  // Base mid-green fill
  ctx.fillStyle = '#3f6b1e'
  ctx.fillRect(0, 0, native, native)

  // Deterministic pixel variation pattern
  const pixels: Array<{ x: number; y: number; color: string }> = [
    { x: 1, y: 0, color: '#2e5016' }, { x: 4, y: 1, color: '#5a8a28' },
    { x: 7, y: 2, color: '#2e5016' }, { x: 2, y: 3, color: '#4a7a22' },
    { x: 9, y: 0, color: '#5a8a28' }, { x: 12, y: 4, color: '#1a3008' },
    { x: 15, y: 1, color: '#2e5016' }, { x: 0, y: 5, color: '#5a8a28' },
    { x: 6, y: 6, color: '#1a3008' }, { x: 10, y: 3, color: '#4a7a22' },
    { x: 14, y: 7, color: '#2e5016' }, { x: 3, y: 8, color: '#5a8a28' },
    { x: 8, y: 9, color: '#1a3008' }, { x: 13, y: 2, color: '#3f6b1e' },
    { x: 5, y: 10, color: '#2e5016' }, { x: 11, y: 11, color: '#5a8a28' },
    { x: 0, y: 12, color: '#4a7a22' }, { x: 16, y: 5, color: '#2e5016' },
    { x: 20, y: 0, color: '#5a8a28' }, { x: 24, y: 3, color: '#1a3008' },
    { x: 28, y: 1, color: '#2e5016' }, { x: 17, y: 8, color: '#5a8a28' },
    { x: 22, y: 6, color: '#1a3008' }, { x: 26, y: 9, color: '#4a7a22' },
    { x: 30, y: 4, color: '#2e5016' }, { x: 19, y: 13, color: '#5a8a28' },
    { x: 23, y: 15, color: '#1a3008' }, { x: 27, y: 12, color: '#3f6b1e' },
    { x: 31, y: 10, color: '#2e5016' }, { x: 18, y: 16, color: '#4a7a22' },
    { x: 25, y: 18, color: '#5a8a28' }, { x: 29, y: 20, color: '#1a3008' },
    { x: 2, y: 17, color: '#2e5016' }, { x: 7, y: 19, color: '#5a8a28' },
    { x: 11, y: 21, color: '#4a7a22' }, { x: 4, y: 22, color: '#1a3008' },
    { x: 9, y: 24, color: '#2e5016' }, { x: 14, y: 26, color: '#5a8a28' },
    { x: 1, y: 28, color: '#1a3008' }, { x: 6, y: 30, color: '#4a7a22' },
    { x: 21, y: 22, color: '#2e5016' }, { x: 16, y: 25, color: '#5a8a28' },
    { x: 28, y: 28, color: '#1a3008' }, { x: 31, y: 31, color: '#4a7a22' },
  ]

  for (const p of pixels) {
    ctx.fillStyle = p.color
    ctx.fillRect(p.x, p.y, 1, 1)
  }

  texture.uScale = 20
  texture.vScale = 20
  texture.update()

  const mat = new BABYLON.StandardMaterial('grass', scene)
  mat.diffuseTexture = texture
  mat.specularColor = new BABYLON.Color3(0, 0, 0)
  mat.backFaceCulling = false
  return mat
}

export function createSkyboxMaterial(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  // Draw sky at 64x64 pixel art resolution
  const native = 64
  const texture = new BABYLON.DynamicTexture('skyTex', { width: native, height: native }, scene, false)
  texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE)

  const ctx = texture.getContext() as CanvasRenderingContext2D

  // Sky gradient: top is deep blue, bottom is light horizon blue
  const skyColors = [
    '#3a6ba8', '#3a6ba8', '#4278b8', '#4278b8',
    '#4a85c4', '#4a85c4', '#5590cc', '#5590cc',
    '#609bd4', '#609bd4', '#6ea4d8', '#6ea4d8',
    '#7cb0de', '#7cb0de', '#8abce4', '#8abce4',
    '#98c8ea', '#98c8ea', '#a6d4f0', '#a6d4f0',
    '#b4dff4', '#b4dff4', '#c2eaf8', '#c2eaf8',
  ]
  const rowHeight = Math.floor(native / skyColors.length)
  for (let i = 0; i < skyColors.length; i++) {
    ctx.fillStyle = skyColors[i]
    ctx.fillRect(0, i * rowHeight, native, rowHeight + 1)
  }

  // Pixel art clouds — blocky rectangular patches
  const clouds: Array<{ x: number; y: number; w: number; h: number; color: string }> = [
    { x: 4, y: 6, w: 12, h: 3, color: '#e8f4fc' },
    { x: 8, y: 5, w: 8, h: 2, color: '#ffffff' },
    { x: 6, y: 8, w: 10, h: 2, color: '#d0e8f8' },
    { x: 38, y: 4, w: 14, h: 3, color: '#e8f4fc' },
    { x: 41, y: 3, w: 10, h: 2, color: '#ffffff' },
    { x: 39, y: 6, w: 12, h: 2, color: '#d0e8f8' },
    { x: 20, y: 14, w: 10, h: 3, color: '#e0eef8' },
    { x: 22, y: 13, w: 6, h: 2, color: '#f0f8ff' },
    { x: 50, y: 18, w: 8, h: 2, color: '#e0eef8' },
    { x: 52, y: 17, w: 5, h: 2, color: '#f0f8ff' },
  ]

  for (const c of clouds) {
    ctx.fillStyle = c.color
    ctx.fillRect(c.x, c.y, c.w, c.h)
  }

  texture.update()

  const mat = new BABYLON.StandardMaterial('skybox', scene)
  mat.diffuseColor = BABYLON.Color3.Black()
  mat.specularColor = BABYLON.Color3.Black()
  mat.emissiveTexture = texture
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
