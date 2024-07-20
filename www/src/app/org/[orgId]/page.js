'use client'
import { useEffect, useState } from 'react'
import { fetchMeetings } from '@/utils'
import _ from 'lodash'
import { useMeetingsStore } from '@/stores'
import GlobalHeader from '@/header'
import Thread from '@/threads'

export default function Project ({ params }) {
  const [list, setList] = useState([])
  useEffect(() => {
    fetchMeetings('/all.json')
      .then(res => res.json())
      .then(data => {
        useMeetingsStore.getState().update(data)
        setList(_.filter(data, { orgId: params.orgId }))
      })
  }, [])
  useEffect(() => {
    document.title = `${list[0].organizor} - DublinThreads`
    document.description = 'Explore updates and developments in Dublin, California.'
    document.url = `https://dublin.amazyyy.com/`
    document.siteName = 'DublinThreads'
    document.type = 'website'
    document.locale = 'en_US'
  }, [])
  return (<div className='bg-[#F3F2EE]'>
    <GlobalHeader />
    <div className='flex items-center flex-col h-full bg-[#F3F2EE]'>
      <main className="flex flex-col items-stretch pt-16 md:p-4 md:pt-[82px] max-w-[1400px] w-full">
        <div className='w-full md:max-w-[800px] m-auto'>
          <div className='text-center p-8 font-bold text-4xl'>
            {list[0] && list[0].organizor}
          </div>
          <Thread thread={list} unit='meetings' />
        </div>
      </main>
      </div>
    </div>
  )
}
