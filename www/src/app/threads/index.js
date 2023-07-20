'use client'
import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'

import { useThreadStore } from '@/stores'
import { fetchDevelopments } from '@/utils'
import AddPost from './add'
import UpdatePost from './update'

function PostCard ({ children }) {
  return (<div className='bg-white self-stretch border-1 p-4'>{children}</div>)
}

function PostPlaceholder () {
  const emptyArray = (length = 5) => (Array.from(Array(length).keys()))

  return <div>
    {emptyArray(20).map(i => (<div key={i} className='flex animate-pulse opacity-10'>
    <div className='flex flex-col self-stretch w-full p-4 bg-gray-50'>
      <div className='flex item-between'>
      <div className='self-stretch mb-1 bg-gray-200 rounded w-64 h-8' />
      <div className='flex-grow self-stretch mb-1 rounded w-96 h-4' />
      <div className='self-stretch mb-1 bg-gray-200 rounded w-24 h-2' />
      </div>
      <div className='self-stretch mb-1 bg-gray-200 rounded w-64 h-4'></div>
      <div className='self-stretch mb-1 bg-gray-200 rounded w-48 h-4'></div>
    </div>
  </div>))}
  </div>
}

function Post ({ data }) {
  data.path.shift()
  switch (data.op) {
    case 'add':
      return (<PostCard><AddPost data={data} /></PostCard>)
    case 'update':
      return (<PostCard><UpdatePost data={data} /></PostCard>)
    // case 'delete':
    //   return (<div className=''>sad</div>)
    default:
      return (<Fragment></Fragment>)
  }
}

export default function Thread () {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        useThreadStore.getState().update(data)
      })
  }, [])
  const thread = useThreadStore(state => state.thread)
  return (
    <div className='flex flex-col w-full md:max-w-2xl py-4 border-x-[0.5px]'>
      <div className='flex flex-col items-center text-center text-gray-600 p-4'>
        <Image
            src="/logos/dublin-threads-app-logo-light.svg"
            alt="Dublin CA Green Logo"
            className='inline-block mr-2 mb-4 rounded-2xl shadow-[0_20px_60px_-5px_rgba(0,0,0,0.3)] bg-white'
            width={68}
            height={68}
            priority
          />
        <div className='text-3xl md:text-5xl font-bold text-green-950 mb-4'>
          A Thread for Dublin
        </div>
        <div>
          This is a thread of {'what\'s'} happening on <a className='text-green-600' href='https://dublin-development.icitywork.com' target='_blank' rel="noreferrer">Dublin Devlopment Projects Site</a>
        </div>
        <div>
          Updated every 30 minutes
        </div>
      </div>
      <div>
        {loading && <PostPlaceholder />}
        {thread.length > 0 && thread.map((post, i) => <Post key={i} data={post} />)}
      </div>
    </div>
  )
}
