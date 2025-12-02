// FILE: src/features/projects/store/project.store.ts
import { create } from 'zustand';
import { Project } from '../types/projects.types'


export type DialogType = 'add' | 'edit' | 'delete' | null

interface StoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: Project | null
  setCurrentRow: (row: Project | null) => void
}

export const useProjectStore = create<StoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}))