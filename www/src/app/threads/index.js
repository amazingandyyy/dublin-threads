'use client'
import { Fragment, useEffect, useState } from 'react'
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

  useEffect(() => {
    if (thread.length > 0) setLoading(false)
  }, [thread])

  const onSearch = _.debounce((e) => {
    const newList = useGlobalThreadListStore.getState().applyFilter(e.target.value)
    useGlobalThreadListStore.getState().update(newList)
  }, 100)

  return (
    <div>
        <div className='flex flex-col hidden'>
          {global && <input className='flex-auto bg-white rounded-xl p-2 pl-4' placeholder='Search for projects or meetings' name='global-search' onChange={onSearch}/>}
          <div className='text-sm opacity-70 mt-2 px-2 mx-auto rounded-xl'>{loading ? (<span className='animate-pulse'>...</span>) : (<span>{thread.length}</span>)} {unit}</div>
        </div>
        <>
          {loading && <PostPlaceholder />}
        </>
        <div className='w-full flex flex-col items-center'>
          {thread.length > 0 && thread.map((post, i) =>
            <Post key={i} data={post} />
          )}
        </div>
    </div>
  )
}

export { Post }
