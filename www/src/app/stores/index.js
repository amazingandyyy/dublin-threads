import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import rdiff from 'recursive-diff'
import _ from 'lodash'

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

const useGlobalThreadListStore = create(
  subscribeWithSelector((set, get) => ({
    list: [],
    originalList: [],
    init: (list) => {
      console.log('init list', list.length)
      set({ list, originalList: list })
    },
    update: (list) => {
      console.log('new list', list.length)
      set({ list })
    },
    applyFilter: (string) => {
      let newList = []
      if (string.length === 0) {
        console.log('reset', get().originalList.length)
        newList = get().originalList
      } else {
        const str = string.split(' ').join('.*')
        const re = new RegExp(`.*${str}.*`, 'ig')
        const list = get().originalList
        newList = _.filter(list, (o) => {
          if (o.organizor) return re.test(o.organizor)
          const projectKeys = _.findKey(useProjectProfileStore.getState().profiles, (i) => {
            return re.test(i.title)
          }) || []
          return projectKeys?.includes(o.projectId)
        })
      }
      return newList
    }
  })
  )
)

export { useMeetingsStore, useThreadStore, useProjectProfileStore, useMapStore, useGlobalThreadListStore }
