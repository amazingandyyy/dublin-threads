import { create } from 'zustand'

const useThreadStore = create((set) => ({
  thread: [],
  update: (thread) => set({ thread })
}))

export { useThreadStore }
