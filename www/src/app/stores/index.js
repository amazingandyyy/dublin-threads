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
    const profiles = {}
    const indivisuals = {}
    data.forEach((post) => {
      indivisuals[post.organizor] = indivisuals[post.organizor] ? [...indivisuals[post.organizor], post].sort((a, b) => b.timestamp - a.timestamp) : [post]
      profiles[post.organizor] = post
    })
    Object.keys(profiles).forEach((k) => {
      profiles[k].meetings = indivisuals[k]
    })
    useOrganizationProfileStore.getState().update(profiles)
    set({ meetings: data })
  },
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

const useOrganizationProfileStore = create((set, get) => ({
  profiles: {},
  update: (profiles) => set({ profiles })
}))

const useMapStore = create((set) => ({
  locations: [],
  update: (locations) => set({ locations })
}))

export { useMeetingsStore, useThreadStore, useProjectProfileStore, useMapStore }
