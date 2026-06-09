import { create } from 'zustand'

interface SearchStore {
  query: string
  isOpen: boolean
  setQuery: (query: string) => void
  open: () => void
  close: () => void
  toggle: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  isOpen: false,
  setQuery: (query) => set({ query }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: '' }),
  toggle: () => set((s) => (s.isOpen ? { isOpen: false, query: '' } : { isOpen: true })),
}))
