import { create } from 'zustand'

interface SceneState {
  hoveredProjectId: string | null
  selectedProjectId: string | null
  cameraInputEnabled: boolean
  setHoveredProject: (id: string | null) => void
  setSelectedProject: (id: string | null) => void
  setCameraInputEnabled: (enabled: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  hoveredProjectId: null,
  selectedProjectId: null,
  cameraInputEnabled: true,
  setHoveredProject: (id) => set({ hoveredProjectId: id }),
  setSelectedProject: (id) =>
    set({ selectedProjectId: id, cameraInputEnabled: id === null }),
  setCameraInputEnabled: (enabled) => set({ cameraInputEnabled: enabled }),
}))
