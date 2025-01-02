'use client'
import { Fragment, useEffect, useState, useRef } from 'react'
import AddPost from './add'
import UpdatePost from './update'
import MeetingPost from './meeting'
import { useGlobalThreadListStore } from '@/stores'
import _ from 'lodash'

function PostPlaceholder () {
  const emptyArray = (length = 5) => (Array.from(Array(length).keys()))

  return <div>
    {emptyArray(20).map(i => (<div key={i} className='flex m-2 animate-pulse opacity-20'>
    <div className='flex flex-col self-stretch w-full p-6 bg-gray-50 md:rounded-2xl'>
      <div className='flex item-between'>
        <div className='self-stretch mb-4 bg-gray-200 rounded-md w-64 h-8' />
        <div className='flex-grow self-stretch mb-2 rounded-full w-96 h-[15px]' />
        <div className='self-stretch mb-2 bg-gray-200 rounded-full w-16 h-[15px]' />
      </div>
      <div className='self-stretch mb-2 bg-gray-200 rounded-full w-96 h-[15px]' />
      <div className='self-stretch mb-2 bg-gray-200 rounded-full w-64 h-[15px]' />
      <div className='self-stretch mb-2 bg-gray-200 rounded-full w-48 h-[15px]' />
    </div>
  </div>))}
  </div>
}

function Post ({ data }) {
  switch (data.type) {
    case 'developments:add':
      return (<AddPost data={data} />)
    case 'developments:update':
      return (<UpdatePost data={data} />)
    case 'meeting':
      return (<MeetingPost data={data} />)
    default:
      return (<Fragment></Fragment>)
  }
}

export default function Thread ({ thread, unit = 'updates', global = false }) {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMoreRef = useRef(null)
  const threadList = useGlobalThreadListStore(state => state.list)
  const totalItems = useGlobalThreadListStore(state => state.originalList.length)

  useEffect(() => {
    if (thread.length > 0) setLoading(false)
  }, [thread])

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0]
        if (first.isIntersecting && !loadingMore && threadList.length < totalItems) {
          setLoadingMore(true)
          try {
            const hasMore = useGlobalThreadListStore.getState().loadMore()
            if (!hasMore) {
              observer.disconnect()
            }
          } finally {
            setLoadingMore(false)
          }
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [loadingMore, threadList.length, totalItems])

  const onSearch = _.debounce((e) => {
    const newList = useGlobalThreadListStore.getState().applyFilter(e.target.value)
    useGlobalThreadListStore.getState().update(newList)
  }, 100)

  const hasMore = threadList.length < totalItems

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='flex flex-col mb-8'>
        {global && (
          <div className='max-w-2xl mx-auto w-full mb-6'>
            <input
              className='w-full bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none'
              placeholder='Search for projects or meetings...'
              name='global-search'
              onChange={onSearch}
            />
          </div>
        )}
        <div className='text-center text-gray-600 text-sm font-medium'>
          {loading
            ? <span className='animate-pulse'>Loading...</span>
            : <span>{threadList.length} of {totalItems} {unit}</span>
          }
        </div>
      </div>

      {loading && <PostPlaceholder />}

      <div className='w-full flex flex-col items-center'>
        {threadList.map((post, i) =>
          <Post key={`${post.projectId}-${i}`} data={post} />
        )}
        {hasMore && !loading && (
          <div
            ref={loadMoreRef}
            className='w-full py-8 flex justify-center'
          >
            <div className={`text-gray-500 ${loadingMore ? 'animate-pulse' : ''}`}>
              {loadingMore ? 'Loading more...' : 'Scroll to load more'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { Post }
