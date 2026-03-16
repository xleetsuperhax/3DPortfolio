import { create } from 'zustand'

interface SceneState {
  hoveredProjectId: string | null
  selectedProjectId: string | null
  cameraInputEnabled: boolean
  showInstructions: boolean
  showAboutMe: boolean
  cameraBlockedHint: boolean
  setHoveredProject: (id: string | null) => void
  setSelectedProject: (id: string | null) => void
  setCameraInputEnabled: (enabled: boolean) => void
  setShowInstructions: (show: boolean) => void
  setShowAboutMe: (show: boolean) => void
  setCameraBlockedHint: (show: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  hoveredProjectId: null,
  selectedProjectId: null,
  cameraInputEnabled: false,
  showInstructions: true,
  showAboutMe: false,
  cameraBlockedHint: false,
  setHoveredProject: (id) => set({ hoveredProjectId: id }),
  setSelectedProject: (id) =>
    set((state) => ({
      selectedProjectId: id,
      cameraInputEnabled: id === null && !state.showInstructions && !state.showAboutMe,
    })),
  setCameraInputEnabled: (enabled) => set({ cameraInputEnabled: enabled }),
  setShowInstructions: (show) =>
    set((state) => ({
      showInstructions: show,
      cameraInputEnabled: !show && state.selectedProjectId === null && !state.showAboutMe,
    })),
  setShowAboutMe: (show) =>
    set((state) => ({
      showAboutMe: show,
      cameraInputEnabled: !show && state.selectedProjectId === null && !state.showInstructions,
    })),
  setCameraBlockedHint: (show) => set({ cameraBlockedHint: show }),
}))
