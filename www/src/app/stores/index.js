import { create } from 'zustand'

const useThreadStore = create((set) => ({
  thread: [],
  projectProfiles: {},
  update: (thread) => {
    const profiles = {}
    thread.forEach((post) => {
      if (post.op === 'add' && Boolean(post.val.title)) profiles[post.projectId] = post.val
    })
    useProjectProfileStore.getState().update(profiles)
    set({ thread })
  }
}))

const useProjectProfileStore = create((set) => ({
  profiles: {},
  update: (profiles) => set({ profiles })
}))

export { useThreadStore, useProjectProfileStore }
