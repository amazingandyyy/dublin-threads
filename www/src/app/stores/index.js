import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import rdiff from 'recursive-diff'

const useThreadStore = create((set, get) => ({
  thread: [],
  update: (data) => {
    const profiles = {}
    const indivisuals = {}
    const batchSize = 10
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      batch.forEach((post) => {
        if (!indivisuals[post.projectId]) {
          indivisuals[post.projectId] = []
        }
        indivisuals[post.projectId].push(post)
        if (post.op === 'add' && Boolean(post.val.title)) {
          profiles[post.projectId] = post.val
        }
      })
    }

    Object.keys(indivisuals).forEach(key => {
      indivisuals[key].sort((a, b) => b.timestamp - a.timestamp)
    })

    Object.keys(profiles).forEach((k) => {
      profiles[k].threads = indivisuals[k]
    })

    useProjectProfileStore.getState().update(profiles)
    useMapStore.getState().update(Object.values(profiles))
    const existingThread = get().thread
    const newThread = existingThread.length > 0 ? [...existingThread, ...data] : data
    set({ thread: newThread })
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
    // console.log('get profile of', id)
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

const useGlobalThreadListStore = create(
  subscribeWithSelector((set, get) => ({
    list: [],
    originalList: [],
    pageSize: 50,
    currentPage: 1,
    init: (list) => {
      const initialItems = list.slice(0, 50)
      set({
        list: initialItems,
        originalList: list,
        currentPage: 1
      })
    },
    loadMore: () => {
      const nextPage = get().currentPage + 1
      const start = (nextPage - 1) * get().pageSize
      const end = start + get().pageSize
      const newItems = get().originalList.slice(start, end)

      if (newItems.length === 0) return false

      requestAnimationFrame(() => {
        set(state => ({
          list: [...state.list, ...newItems],
          currentPage: nextPage
        }))
      })

      return true
    },
    update: (list) => {
      const initialItems = list.slice(0, 50)
      set({
        list: initialItems,
        originalList: list,
        currentPage: 1
      })
    },
    applyFilter: (string) => {
      if (string.length === 0) {
        return get().originalList.slice(0, 50)
      }

      const str = string.split(' ').join('.*')
      const re = new RegExp(`.*${str}.*`, 'ig')
      const profiles = useProjectProfileStore.getState().profiles

      return get().originalList
        .filter(o => {
          if (o.organizor) return re.test(o.organizor)
          return Object.keys(profiles).some(key =>
            profiles[key].title && re.test(profiles[key].title) && key === o.projectId
          )
        })
        .slice(0, 50)
    }
  }))
)

export { useMeetingsStore, useThreadStore, useProjectProfileStore, useMapStore, useGlobalThreadListStore }
