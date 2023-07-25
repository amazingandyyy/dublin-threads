'use client'
import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'

import { useThreadStore } from '@/stores'
import { fetchDevelopments } from '@/utils'
import AddPost from './add'
import UpdatePost from './update'

function PostPlaceholder () {
  const emptyArray = (length = 5) => (Array.from(Array(length).keys()))

  return <div>
    {emptyArray(20).map(i => (<div key={i} className='flex md:rounded-xl my-2 animate-pulse opacity-20'>
    <div className='flex flex-col self-stretch w-full p-4 bg-gray-50'>
      <div className='flex item-between'>
        <div className='self-stretch mb-4 bg-gray-200 rounded-full w-64 h-8' />
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
  data.path.shift()
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
    <div className='flex flex-col w-full md:max-w-2xl py-4 border-x-[0px]'>
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
      <div className='flex flex-col'>
        <div className='flex justify-end text-xs pr-2'>
          <div>{loading ? (<span className='animate-pulse'>...</span>) : (<span>{thread.length}</span>)} updates</div>
        </div>
        <div>
          {loading && <PostPlaceholder />}
          {thread.length > 0 && thread.map((post, i) => <Post key={i} data={post} />)}
        </div>
      </div>
    </div>
  )
}
