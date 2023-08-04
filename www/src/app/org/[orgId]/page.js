'use client'
import { useEffect } from 'react'
import {fetchMeetings} from '@/utils'
import {useMeetingsStore} from '@/stores'
import GlobalHeader from '@/header'
import ProjectBento from '././projectBento'

export default function Project ({ params }) {
  useEffect(() => {
    fetchMeetings('/all.json')
      .then(res => res.json())
      .then(data => {
        useMeetingsStore.getState().update(data)
      })
  }, [])
  return (<div className='bg-[#F3F2EE]'>
    <GlobalHeader />
    <div className='flex items-center flex-col h-full bg-[#F3F2EE]'>
      <main className="flex flex-col items-stretch pt-16 md:p-4 md:pt-[82px] max-w-[1400px]">
        {params.orgId}
      </main>
      </div>
    </div>
  )
}
