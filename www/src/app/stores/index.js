import { create } from 'zustand'
import rdiff from 'recursive-diff'

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
    Object.keys(profiles).forEach((k) => {
      profiles[k].threads = singleThread[k]
    })
    useProjectProfileStore.getState().update(profiles)
    useMapStore.getState().update(Object.values(profiles))
    set({ thread })
  }
}))

const useProjectProfileStore = create((set, get) => ({
  profiles: {},
  update: (profiles) => set({ profiles }),
  current: (projectId) => {
    console.log('get profile of', projectId)
    const profile = get().profiles[projectId] || { threads: [] }
    const diff = profile?.threads.map(i => ({ path: i.path, op: i.op, val: i.val })).reverse() || []
    const current = rdiff.applyDiff({}, diff)
    return current[projectId] || get().profiles[projectId]
  }
}))

const useMapStore = create((set) => ({
  locations: [],
  update: (locations) => set({ locations })
}))

export { useThreadStore, useProjectProfileStore, useMapStore }
