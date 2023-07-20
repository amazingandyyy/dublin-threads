import { create } from 'zustand'

const useThreadStore = create((set) => ({
  thread: [],
  update: (thread) => {
    const profiles = {}
    const singleThread = {}
    thread.forEach((post) => {
      if (post.op === 'add' && Boolean(post.val.title)) profiles[post.projectId] = post.val
      singleThread[post.projectId] = singleThread[post.projectId] ? [...singleThread[post.projectId], post].sort((a, b) => b.timestamp - a.timestamp) : [post]
    })
    useSingleProjectStore.getState().update(singleThread)
    useProjectProfileStore.getState().update(profiles)
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

export { useThreadStore, useProjectProfileStore }
