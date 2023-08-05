'use client'
import Thread from './index'
import GlobalHeader from '../header'
// import Image from 'next/image'
import { useMeetingsStore, useThreadStore } from '@/stores'
import { useEffect, useState } from 'react'

export default function Threads () {
  const thread = useThreadStore(state => state.thread)
  const meetings = useMeetingsStore(state => state.meetings)
  const [list, setList] = useState([])

  useEffect(() => {
    const r = [...thread, ...meetings].sort((a, b) => b.timestamp - a.timestamp)
    setList(r)
  }, [thread, meetings])

  return (
    <>
      <GlobalHeader />
      <main className="pt-16 h-full bg-[#F3F2EE]">
        <div className='flex flex-col items-center text-center text-gray-600 p-4 pt-16'>
          {/* <Image */}
          {/*  src="/logos/dublin-threads-app-logo-light.svg" */}
          {/*  alt="Dublin CA Green Logo" */}
          {/*  className='inline-block m-2 mb-4 rounded-full shadow-[0_20px_60px_-5px_rgba(0,0,0,0.3)] bg-white' */}
          {/*  width={68} */}
          {/*  height={68} */}
          {/*  priority */}
          {/* /> */}
          <div className='text-3xl md:text-5xl font-bold text-green-950 mb-4'>
            A Thread for Dublin, CA
          </div>
          <div>
            This is a thread of {'what\'s'} updates on <a className='text-green-600' href='https://dublin-development.icitywork.com' target='_blank' rel="noreferrer">Dublin Devlopment Projects Site</a> and <a className='text-green-600' href='https://dublin.ca.gov/1604/Meetings-Agendas-Minutes-Video-on-Demand' target='_blank' rel="noreferrer">Dublin Meetings Site</a>
          </div>
          <div className='py-2'>
            {["DublinCA", "California", "TriValley"].map(i=>{
              return <span className='py-1 px-2 bg-green-400 m-1 rounded-full text-xs text-green-800 bg-opacity-40'>#{i}</span>
            })}
          </div>
          <div className='text-sm'>
            Updated every 30 minutes
          </div>
        </div>
        <div className='w-full md:max-w-[800px] m-auto'>
          <Thread thread={list} />
        </div>
      </main>
    </>
  )
}
