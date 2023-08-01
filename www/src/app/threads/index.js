'use client'
import { Fragment, useEffect, useState } from 'react'
import AddPost from './add'
import UpdatePost from './update'

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
  switch (data.op) {
    case 'add':
      return (<AddPost data={data} />)
    case 'update':
      return (<UpdatePost data={data} />)
    // case 'delete':
    //   return (<div className=''>sad</div>)
    default:
      return (<Fragment></Fragment>)
  }
}

export default function Thread ({ thread }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (thread.length > 0) setLoading(false)
  }, [thread])

  return (
    <div>
        <div className='flex flex-col'>
          <div className='bg-white bg-opacity-50 text-sm opacity-70 py-1 my-4 px-2 mx-auto rounded-xl'>{loading ? (<span className='animate-pulse'>...</span>) : (<span>{thread.length}</span>)} updates</div>
        </div>
        <>
          {loading && <PostPlaceholder />}
        </>
        <>
          {thread.length > 0 && thread.map((post, i) =>
            <Post key={i} data={post} />
          )}
        </>
    </div>
  )
}

export { Post }
