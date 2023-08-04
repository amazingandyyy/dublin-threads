import { create } from 'zustand'
import rdiff from 'recursive-diff'

const useThreadStore = create((set, get) => ({
  thread: [],
  update: (data) => {
    const profiles = {}
    const indivisuals = {}
    data.forEach((post) => {
      indivisuals[post.projectId] = indivisuals[post.projectId] ? [...indivisuals[post.projectId], post].sort((a, b) => b.timestamp - a.timestamp) : [post]
      if (post.op === 'add' && Boolean(post.val.title)) {
        profiles[post.projectId] = post.val
      }
    })
    Object.keys(profiles).forEach((k) => {
      profiles[k].threads = indivisuals[k]
    })
    useProjectProfileStore.getState().update(profiles)
    useMapStore.getState().update(Object.values(profiles))
    set({ thread: data })
  }
}))

const useMeetingsStore = create((set, get) => ({
  meetings: [],
  update: (data) => {
    set({ meetings: data })
  }
}))

const useProjectProfileStore = create((set, get) => ({
  profiles: {},
  update: (profiles) => set({ profiles }),
  current: (id) => {
    console.log('get profile of', id)
    const profile = get().profiles[id] || { threads: [] }
    const diff = profile?.threads.map(i => ({ path: i.path, op: i.op, val: i.val })).reverse() || []
    const current = rdiff.applyDiff({}, diff)
    return current[id] || get().profiles[id]
  }
}))

const useMapStore = create((set) => ({
  locations: [],
  update: (locations) => set({ locations })
}))

export { useMeetingsStore, useThreadStore, useProjectProfileStore, useMapStore }
