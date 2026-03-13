import { create } from 'zustand'

interface SceneState {
  hoveredProjectId: string | null
  selectedProjectId: string | null
  cameraInputEnabled: boolean
  showInstructions: boolean
  setHoveredProject: (id: string | null) => void
  setSelectedProject: (id: string | null) => void
  setCameraInputEnabled: (enabled: boolean) => void
  setShowInstructions: (show: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  hoveredProjectId: null,
  selectedProjectId: null,
  cameraInputEnabled: false,
  showInstructions: true,
  setHoveredProject: (id) => set({ hoveredProjectId: id }),
  setSelectedProject: (id) =>
    set((state) => ({
      selectedProjectId: id,
      cameraInputEnabled: id === null && !state.showInstructions,
    })),
  setCameraInputEnabled: (enabled) => set({ cameraInputEnabled: enabled }),
  setShowInstructions: (show) =>
    set((state) => ({
      showInstructions: show,
      cameraInputEnabled: !show && state.selectedProjectId === null,
    })),
}))
