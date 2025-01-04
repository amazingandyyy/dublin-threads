'use client'
import Thread from './index'
import GlobalHeader from '../header'
import CreatePost from './CreatePost'
import { useGlobalThreadListStore, useMeetingsStore, useThreadStore } from '@/stores'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchDevelopments, fetchMeetings } from '@/utils'

export default function Threads () {
  const thread = useThreadStore(state => state.thread)
  const meetings = useMeetingsStore(state => state.meetings)
  const list = useGlobalThreadListStore(state => state.list)
  const searchParams = useSearchParams()

  useEffect(() => {
    document.title = 'Threads - DublinThreads'
    document.description = 'Explore updates and developments in Dublin, California.'
    document.url = 'https://dublin.amazyyy.com/'
    document.siteName = 'DublinThreads'
    document.type = 'website'
    document.locale = 'en_US'
  }, [])

  // Initial data fetch - only get first 50 items
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch first page of meetings
        const meetingsRes = await fetchMeetings('/all.json?page=1&limit=50')
        const meetingsData = await meetingsRes.json()
        useMeetingsStore.getState().update(meetingsData)

        // Fetch first page of developments
        const developmentsRes = await fetchDevelopments('/logs/global.json?page=1&limit=50')
        const developmentsData = await developmentsRes.json()
        useThreadStore.getState().update(developmentsData)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }

    fetchInitialData()
  }, [])

  // Process and combine data
  useEffect(() => {
    const filter = searchParams.get('f')
    let l = []

    if (filter === 'meetings') {
      l = [...meetings].sort((a, b) => b.timestamp - a.timestamp)
    } else if (filter === 'highlights') {
      l = [...thread].sort((a, b) => b.timestamp - a.timestamp).filter(i => {
        if (i.path?.includes('images')) return true
        if (i.images?.length > 0) return true
        if (i.val?.images?.length > 0) return true
        return false
      })
    } else {
      // Combine and sort only the loaded items
      l = [...thread, ...meetings].sort((a, b) => b.timestamp - a.timestamp)
    }

    useGlobalThreadListStore.getState().init(l)
  }, [thread, meetings, searchParams])

  return (
    <>
      <GlobalHeader />
      <main className="min-h-screen bg-[#F3F2EE] relative">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="fixed -top-24 -right-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className='flex flex-col items-center text-center text-gray-600 pt-12 sm:pt-16'>
            <div className='font-playfair text-2xl sm:text-3xl md:text-6xl font-bold text-green-950 mb-4 sm:mb-6 px-2'>
              A Thread for <span className="text-green-700">Dublin, CA</span>
            </div>
            <div className='py-1 sm:py-2 mb-4 sm:mb-6'>
              {['DublinCA', 'California', 'TriValley'].map(i => {
                return <span key={i} className='py-0.5 sm:py-1 px-2 bg-green-300 m-0.5 sm:m-1 rounded-full text-xs sm:text-sm font-bold text-green-900 bg-opacity-40'>#{i}</span>
              })}
            </div>
          </div>
          <div className='w-full md:max-w-[800px] m-auto'>
            <div className="flex items-center justify-center gap-1.5 bg-white/50 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm border border-green-100 mb-4 sm:mb-6 mx-2 sm:mx-0">
              <span className="bg-green-600 text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full tracking-wide">NEW</span>
              <p className="text-green-800 text-xs sm:text-sm font-medium">
                You can now share your thoughts about Dublin! ✨ 🍀
              </p>
            </div>
            <CreatePost />
            <Thread thread={list} global={true} />
          </div>
        </div>
      </main>
    </>
  )
}
