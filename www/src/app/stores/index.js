import { create } from 'zustand'

const useThreadStore = create((set) => ({
  thread: [],
  update: (thread) => {
    const profiles = {}
    const singleThread = {}
    thread.forEach((post) => {
      singleThread[post.projectId] = singleThread[post.projectId] ? [...singleThread[post.projectId], post].sort((a, b) => b.timestamp - a.timestamp) : [post]
      if (post.op === 'add' && Boolean(post.val.title)) {
        profiles[post.projectId] = post.val
      }
    })
    useSingleProjectStore.getState().update(singleThread)
    Object.keys(profiles).forEach((k) => {
      profiles[k].threads = singleThread[k]
    })
    useProjectProfileStore.getState().update(profiles)
    useMapStore.getState().update(Object.values(profiles))
    set({ thread })
  }
}))

const useSingleProjectStore = create((set) => ({
  thread: {},
  update: (thread) => {
    set({ thread })
  }
}))

const useProjectProfileStore = create((set) => ({
  profiles: {},
  update: (profiles) => set({ profiles })
}))

const useMapStore = create((set) => ({
  locations: [],
  update: (locations) => set({ locations })
}))

export { useThreadStore, useProjectProfileStore, useMapStore }
