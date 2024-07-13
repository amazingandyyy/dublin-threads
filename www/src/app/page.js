'use client'
import { useEffect } from 'react'
import { fetchDevelopments, fetchMeetings } from '@/utils'
import { useThreadStore, useMeetingsStore } from '@/stores'
import Threads from '@/threads/page'

export default function Home () {
  useEffect(() => {
    fetchMeetings('/all.json')
      .then(res => res.json())
      .then(data => {
        console.log('hello')
        console.log('fetching meetings', data[0])
        useMeetingsStore.getState().update(data)
      })
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        console.log('fetching developments event', data[0])
        useThreadStore.getState().update(data)
      })
  }, [])
  return (<Threads />)
}
