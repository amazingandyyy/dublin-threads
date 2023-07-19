'use client'
import { Fragment, useEffect } from 'react'
import Image from 'next/image'

import { useThreadStore } from '../stores'
import { fetchDevelopments } from '../utils'
import AddPost from './add'
import UpdatePost from './update'

function PostCard ({children}) {
  return (<div className='bg-white self-stretch border-b-4 md:border-b-0 md:m-2 md:drop-shadow md:rounded-xl p-4'>{children}</div>)
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
  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        console.log(data.slice(0))
        useThreadStore.getState().update(data)
      })
  }, [])
  const thread = useThreadStore(state => state.thread)
  return (
    <div className='flex flex-col w-full md:max-w-2xl pt-8'>
      <div className='flex flex-col items-center text-center text-gray-600 py-4'>
        <Image
            src="/images/dublin-green.svg"
            alt="Dublin CA Green Logo"
            className='inline-block mr-2'
            width={64}
            height={64}
            priority
          />
        <div className='text-5xl font-bold text-green-950 mb-4'>
          A Thread for Dublin
        </div>
        <div>
          This is a thread of what's happening on <a className='text-green-600' href='https://dublin-development.icitywork.com' target='_blank'>Dublin Devlopment Projects Site</a>
        </div>
        <div>
          Updated every 30 minutes
        </div>
      </div>
      {thread.map((post, i) => <Post key={i} data={post} />)}
    </div>
  )
}
