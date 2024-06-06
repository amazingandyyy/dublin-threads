'use client'
import Thread from './index'
import GlobalHeader from '../header'
import { useGlobalThreadListStore, useMeetingsStore, useThreadStore } from '@/stores'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Threads () {
  const thread = useThreadStore(state => state.thread)
  const meetings = useMeetingsStore(state => state.meetings)
  const list = useGlobalThreadListStore(state => state.list)
  const searchParams = useSearchParams()

  useEffect(() => {
    // const filter = searchParams.get('f')
    // let l = [...thread].sort((a, b) => b.timestamp - a.timestamp)
    // if (filter === 'meetings') {
    //   l = [...meetings].sort((a, b) => b.timestamp - a.timestamp)
    // } else if (filter === 'highlights') {
    //   l = [...thread].sort((a, b) => b.timestamp - a.timestamp).filter(i => {
    //     if (i.path.includes('images')) return true
    //     else if (i.images?.length > 0) return true
    //     else if (i.val?.images?.length > 0) return true
    //     return false
    //   })
    // }
    const l = [...thread].sort((a, b) => b.timestamp - a.timestamp).filter(i => {
      if (i.path.includes('images')) return true
      else if (i.images?.length > 0) return true
      else if (i.val?.images?.length > 0) return true
      return false
    })
    useGlobalThreadListStore.getState().init(l)
  }, [thread, meetings, searchParams])

  return (
    <>
      <GlobalHeader />
      {/* <main className='pt-16 h-full bg-[#F3F2EE]'> */}
      <main className='pt-16 h-full bg-gray-100'>
        <div className='flex flex-col items-center text-center text-gray-600 p-4 pt-16'>
          {/* <Image */}
          {/*  src='/logos/dublin-threads-app-logo-light.svg' */}
          {/*  alt='Dublin CA Green Logo' */}
          {/*  className='inline-block m-2 mb-4 rounded-full shadow-[0_20px_60px_-5px_rgba(0,0,0,0.3)] bg-white' */}
          {/*  width={68} */}
          {/*  height={68} */}
          {/*  priority */}
          {/* /> */}
          <div className='text-3xl md:text-5xl font-bold text-green-950 mb-4'>
            A Thread for <span>Dublin, CA</span>
          </div>
          <div>
            Sourced from <a className='italic' href='https://dublin-development.icitywork.com' target='_blank' rel='noreferrer'>Dublin Devlopment Projects Site</a>
            {/* and <a className='text-green-600' href='https://dublin.ca.gov/1604/Meetings-Agendas-Minutes-Video-on-Demand' target='_blank' rel='noreferrer'>Dublin Meetings Site</a> */}
            <br/>
            Built by the community in Dublin
          </div>
          <div className='py-2'>
            {['DublinCA', 'California', 'TriValley'].map(i => {
              return <span key={i} className='py-1 px-2 bg-green-400 m-1 rounded-full text-xs text-green-800 bg-opacity-40'>#{i}</span>
            })}
          </div>
          {/* <div className='text-sm'> */}
          {/*   Updated every 15 minutes */}
          {/* </div> */}
        </div>
        <div className='w-full md:max-w-[800px] m-auto'>
          <Thread thread={list} global={true} />
        </div>
      </main>
    </>
  )
}
