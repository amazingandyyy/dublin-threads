'use client'
import { useEffect, useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useProjectProfileStore, useThreadStore } from '@/stores'
import GlobalHeader from '@/header'
import { fetchDevelopments } from '@/utils'
import Link from 'next/link'

function getSeconds (date) {
  const dateArr = date.split('/')
  const standardDate = new Date(`${dateArr[2]}-${dateArr[0]}-${dateArr[1]}T00:00:00.000Z`)
  const seconds = standardDate.getTime() // 1440516958
  return seconds
}

export default function Threads ({ params, searchParams }) {
  const projects = useProjectProfileStore(state => state.profiles)
  const [highlights, setHighlights] = useState([])
  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        console.log('fetching developments event', data[0])
        useThreadStore.getState().update(data)
      })
  }, [])

  useEffect(() => {
    document.title = 'Explorer - DublinThreads'
    document.description = 'Explore Dublin projects and developments on a map.'
    document.url = 'https://dublin.amazyyy.com/explore'
    document.siteName = 'DublinThreads'
    document.type = 'website'
    document.locale = 'en_US'
  }, [])

  useEffect(() => {
    console.log('projects', projects)
    const r = []
    for (const project in projects) {
      const p = projects[project]
      r.push(p)
    }
    r.sort((a, b) => {
      return getSeconds(b.details['Application Submittal Date']) - getSeconds(a.details['Application Submittal Date'])
    })
    setHighlights(r)
  }, [projects])

  return (<>
    <GlobalHeader />
    <main className="py-16">
      <div className='flex flex-col items-center px-4'>
        <div className='flex flex-col items-center text-center text-gray-600 p-4 pt-16'>
          <div className='font-handwriting text-3xl md:text-6xl font-bold text-green-950 mb-4'>
            Explorer
          </div>
          <div>
            This is an <b>experimental feature</b>. Currently under active development
            <br/>
            Many images are broken, I will find time to fix them
          </div>
          <div className='py-2'>
            {['DublinCA', 'California', 'TriValley'].map(i => {
              return <span key={i} className='py-1 px-2 bg-green-300 m-1 rounded-full text-sm font-bold text-green-900 bg-opacity-40'>#{i}</span>
            })}
          </div>
        </div>
        {/* <div className='pb-12 flex flex-col items-center'> */}
        {/*  <h1 className='text-3xl font-bold pb-4'>Explorer v0</h1> */}
        {/*  <div className='bg-green-50 rounded-full px-4 py-2 italic mb-2'>Many images are currently <b>broken</b>, I will find time to fix them.</div> */}
        {/*  <div className='bg-green-50 rounded-full px-4 py-2 italic mb-2'>Under <b>active</b> development</div> */}
        {/* </div> */}
        {highlights.map((project) => {
          return <div key={project.id} className='pb-8 w-full md:max-w-3xl'>
            <Link href={`/project/${project.id}`} className='hover:opacity-70 flex flex-row justify-between'>
              <span className='font-semibold text-xl text-green-950'>{project.title}</span> <small className='text-gray-400'>{project.details['Application Submittal Date']}</small>
            </Link>
            <div className='flex flex-row'>
              {project.images && project.images.length > 0 && <div>
                {project.images.slice(0, 5).map((image, index) => (
                  <Link key={`${project.id}-${index}`} href={`/project/${project.id}`} className='hover:opacity-70 inline-block'>
                    <img src={image.thumbnail} className='shadow-xl bg-white m-[5px] inline-block rounded-xl w-36 h-36' />
                  </Link>
                ))}
              </div>}
            </div>
          </div>
        })}
        more to come...
      </div>
    </main>
  </>)
}
