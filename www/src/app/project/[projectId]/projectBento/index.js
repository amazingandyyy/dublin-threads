'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useState, useEffect } from 'react'
import { useProjectProfileStore, useThreadStore } from '@/stores'
import Map, { Marker } from 'react-map-gl'
import {
  MapPinIcon as OutlineMapPinIcon,
  InboxStackIcon,
  Square3Stack3DIcon,
  BuildingLibraryIcon,
  PhoneIcon,
  LinkIcon,
  ClockIcon,
  InboxIcon,
  PhotoIcon,
  DocumentPlusIcon,
  ChatBubbleBottomCenterTextIcon, TrophyIcon
} from '@heroicons/react/24/outline'
import './style.scss'
import { MapPinIcon } from '@heroicons/react/20/solid'
import { timeSince, Image, useArchivedSource, fetchDevelopments } from '@/utils'
import Threads from '@/threads'
import { DiscussionEmbed } from 'disqus-react'

export default function ProjectBento ({ projectId }) {
  const [project, setProject] = useState({})
  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        useThreadStore.getState().update(data)
      })
  }, [])

  useProjectProfileStore.subscribe(() => {
    setProject(useProjectProfileStore.getState().current(projectId))
  })

  useEffect(() => {
    console.log('project details', project)
    document.title = `${project.title} - DublinThreads`
    document.description = project.description
    document.image = project.images?.[0]?.thumbnail
    document.url = `https://dublin.amazyyy.com/project/${project.id}`
    document.siteName = 'DublinThreads'
    document.type = 'website'
    document.locale = 'en_US'
  }, [project])

  const renderApplicant = (project) => {
    const applicant = project?.details.Applicant
    if (!applicant.name) return <></>

    const name = applicant.name
    const address = applicant.address
    const phone = applicant.phone
    return (<div className='flex flex-col system-card bg-white p-8 md:rounded-2xl md:m-2 my-1'>
      <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3'>Applicant</div>
      <div>
        <div className='text-xl font-bold my-2'>{name}</div>
        <a href={`https://www.google.com/maps/place/${address.split(' ').join('+')}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
          <OutlineMapPinIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{address}</div>
        </a>
        <div className='text-md flex items-center pb-2'>
          <PhoneIcon className='h-4 w-4 flex-none inline mr-2' /><div>{phone}</div>
        </div>
        <a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
          <LinkIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>Reach out on LinkedIn</div>
        </a>
        <a href={`https://www.google.com/search?q=${encodeURIComponent(name)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
          <LinkIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>Google Search</div>
        </a>
      </div>
    </div>)
  }
  const renderStats = (project) => {
    // https://www.linkedin.com/search/results/all/?keywords=Jerry%20Hunt%2C%20Rubicon%20Property%20Group&sid=Qwm
    return (<div className='flex flex-col md:rounded-2xl system-card bg-white p-8 md:m-2 my-1'>
    <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3'>Statistics</div>
    <div className='pt-4'>
      <div className='text-md flex items-center pb-2'>
        <PhotoIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{project?.images?.length} images</div>
      </div>
      <div className='text-md flex items-center pb-2'>
        <DocumentPlusIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{project?.docs?.length} documents</div>
      </div>
      <div className='text-md flex items-center pb-2'>
        <ChatBubbleBottomCenterTextIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{project?.threads?.length} updates</div>
      </div>
    </div>
    </div>)
  }
  const renderProjectPlanner = (project) => {
    const person = project?.details['Project Planner']

    const name = person?.name
    const email = person?.email
    const phone = person?.phone
    // https://www.linkedin.com/search/results/all/?keywords=Jerry%20Hunt%2C%20Rubicon%20Property%20Group&sid=Qwm
    return (<div className='flex flex-col md:rounded-2xl system-card bg-white p-8 md:m-2 my-1'>
    <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3'>Project Planner</div>
    <div>
      <div className='text-xl font-bold my-2'>{name}</div>
      <div className='text-md flex items-center pb-2'>
        <InboxIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{email}</div>
      </div>
      <div className='text-md flex items-center pb-2'>
        <PhoneIcon className='h-4 w-4 flex-none inline mr-2' /><div>{phone}</div>
      </div>
      <a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(`${name} ${email}`)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
        <LinkIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>Reach out on LinkedIn</div>
      </a>
      <a href={`https://www.google.com/search?q=${encodeURIComponent(`${name} ${email} ${phone}`)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
        <LinkIcon className='h-4 w-4 flex-none inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>Google Search</div>
      </a>
    </div>
    </div>)
  }

  const renderDocuments = (project) => {
    return (<div className='flex flex-col'>
      <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3 mb-4'>Documents</div>
      <div>
        {project?.docs?.length > 0
          ? <div>{project?.docs?.map(doc => (<div key={doc.url}>
            <a href={useArchivedSource(doc.url)} target='_blank' className='w-full inline-block py-2 text-green-800 hover:text-green-600 truncate ...' rel="noreferrer">
              <div className='max-w-xs md:max-w-full inlin-block break-words truncate ... text-ellipsis'>📁 {doc.name || 'Document'}</div>
            </a>
          </div>))}
        </div>
          : <div className='pt-4'>0 documents available</div>}
      </div>
    </div>)
  }

  const RenderThreads = ({ project }) => {
    return (<div className='w-full md:max-w-[800px] m-auto'>
      <Threads thread={project.threads.slice(0)} />
    </div>)
  }
  const renderImages = (images) => {
    if (images?.length === 0) {
      return (
      <div className='md:rounded-2xl system-card bg-white p-8'>
        <div className='inline border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3'>Images</div>
        <div className='pt-4'>0 images available</div>
      </div>
      )
    }
    return (<>
          {images.map((image) => (<Image
            key={image.original}
            src={image.original}
            style={{ width: '100%', height: 'auto' }}
            className='system-card md:rounded-2xl m-0 mb-1 md:mb-4'
          />)
          )}
      </>)
  }
  const renderSubmittalDate = (project) => {
    const date = project?.details['Application Submittal Date']
    const dateArr = date.split('/')
    const standardDate = new Date(`${dateArr[2]}-${dateArr[0]}-${dateArr[1]}T00:00:00.000Z`)
    const seconds = standardDate.getTime() // 1440516958

    return (<div className='flex flex-col md:rounded-2xl system-card bg-white p-8 md:m-2 mb-1 h-full text-center items-center justify-center'>
      <div className='flex flex-col items-center'>
        <ClockIcon className='w-6 h-6 text-emerald-500' />
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600'>Submitted</div>
        <div className='text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 py-2 font-extralight'>{timeSince(seconds)}</div>
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 py-2'>ago on {date}</div>
      </div>
    </div>)
  }
  const renderLatestUpdateDate = (project) => {
    return (<div className='flex flex-col md:rounded-2xl system-card bg-white p-8 md:m-2 mb-1 h-full text-center items-center justify-center'>
      <div className='flex flex-col items-center'>
        <ClockIcon className='w-6 h-6 text-emerald-500' />
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600'>Lastest updated</div>
        <div className='text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 py-2 font-extralight'>{timeSince(project?.threads[0]?.timestamp)}</div>
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 py-2'>ago</div>
      </div>
    </div>)
  }
  const renderStatus = (project) => {
    const status = project?.status
    return (<div className='md:rounded-2xl system-card bg-white md:m-2 h-full bg-gradient-to-r from-emerald-500 to-lime-600 py-1 md:p-1'>
    <div className='flex flex-col bg-white p-8 h-full w-full md:rounded-xl text-white items-center text-center justify-center'>
      <div className='flex flex-col items-center'>
        <TrophyIcon className='w-6 h-6 text-emerald-500' />
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600'>Current Status</div>
        <div className='text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 font-extrabold py-2'>{status}</div>
      </div>
    </div>
    </div>)
  }

  const renderMap = (project) => {
    return (<Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: project?.geolocation?.lon,
        latitude: project?.geolocation?.lat,
        zoom: 14
      }}
      // minZoom={14}
      style={{ borderRadius: '12px', height: '100%' }}
      mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
    >
      {project?.geolocation?.lon && <Marker key={project.title} longitude={project?.geolocation?.lon} latitude={project?.geolocation?.lat}>
        <a href={`https://www.google.com/maps/place/${project?.geolocation?.lat},${project?.geolocation?.lon}`} target='_blank' rel='noreferrer'>
          <div className='flex flex-col text-white items-center' id='single-map-marker'>
            <div className='flex items-center text-center leading-5 hover:scale-110 text-l bg-gradient-to-r from-emerald-500 to-lime-600 shadow-xl text-lg py-1 px-4 rounded-full font-semibold'>
              <MapPinIcon className='h-4 w-4 flex-none inline mr-1' />
              <div>{project.location}</div>
            </div>
            <div className='bg-gradient-to-r from-emerald-500 to-lime-600 w-1 h-4 shadow-2xl'></div>
          </div>
        </a>
      </Marker>}
    </Map>)
  }

  const renderDescription = (project) => {
    return (<div className='flex flex-col justify-between h-full'>
      <div className='mb-8 text-lg opacity-80'>{project.description}</div>
      <div>
        <div className='flex items-center pb-2'><BuildingLibraryIcon className='h-4 w-4 flex-none inline mr-2' />{project.details['Planning Application #']}</div>
        <div className='flex items-center pb-2'><InboxStackIcon className='h-4 w-4 flex-none inline mr-2' />{project.details['Application Type']}</div>
        <div className='flex items-center pb-2'><Square3Stack3DIcon className='h-4 w-4 flex-none inline mr-2' />{project.details['General Plan Land Use']}</div>
      </div>
    </div>)
  }

  const renderProjectDetails = (project) => {
    const ignoreKeys = ['Applicant', 'Project Planner']
    const detailsKeys = Object.keys(project.details).filter((k) => !ignoreKeys.includes(k))
    return <div>{detailsKeys.map(k => {
      const v = project.details[k]
      if (typeof v === 'string') {
        return (<div key={k} className='flex flex-col pb-4'>
        <div className='flex items-center font-semibold'>{k}</div>
        <div className='flex items-center'>{v}</div>
      </div>)
      } else {
        return <></>
      }
    })}</div>
  }

  const renderDiscusstion = (project) => {
    return (<div className='md:rounded-2xl system-card bg-white p-8'>
      <div className='inline-block self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3 mb-4'>Open discussions</div>
      <DiscussionEmbed
        shortname='dublin-threads'
        config={
          {
            url: `https://dublin.amazyyy.com/project/${project.id}`,
            identifier: project.id,
            title: project.title,
            language: 'en'
          }
        }
      />
    </div>)
  }

  if (!project.id) {
    return (<div>Loading...</div>)
  } else {
    return (<>
      <div className='flex flex-col md:flex-row'>
        <div className='md:rounded-2xl system-card bg-white flex p-8 flex-col md:m-2 my-1 md:flex-none md:max-w-[300px]'>
          <div className='flex flex-col justify-between h-full'>
            <div className='text-4xl font-bold'>{project.title}</div>
            <div className='opacity-50'>@{project.id}</div>
          </div>
        </div>
        <div className='md:rounded-2xl system-card overflow-scroll bg-white flex p-8 flex-col md:m-2 my-1'>
          {renderDescription(project)}
        <div>
        </div>
        </div>
        <div className='md:rounded-2xl system-card w-screen md:w-full overflow-hidden md:h-auto h-[300px] md:min-w-[300px] md:max-w-[400px] md:m-2 my-1'>
          {renderMap(project)}
        </div>
      </div>
      <div className='flex flex-col md:flex-row'>
        <div className='flex flex-row max-w-lg md:rounded-2xl system-card bg-white p-8 md:m-2 my-1'>
          {renderProjectDetails(project)}
        </div>
        <div className='flex flex-col flex-1'>
          {renderStatus(project)}
          {renderSubmittalDate(project)}
          {renderLatestUpdateDate(project)}
        </div>
        <div className='flex flex-col flex-1'>
          {renderApplicant(project)}
          {renderProjectPlanner(project)}
          {renderStats(project)}
        </div>
      </div>
      <div className='md:p-2'>
        {renderDiscusstion(project)}
      </div>
      <div className='w-full md:p-2'>
        {renderImages(project?.images)}
      </div>
      <div className='w-full md:p-2'>
        <div className='md:rounded-2xl system-card bg-white p-8'>
          {renderDocuments(project)}
        </div>
      </div>
      <div className='md:py-8'>
          <div className='text-center py-12 px-4'>
              <div className='text-3xl md:text-5xl font-bold text-green-950 mb-4'>
                  Threads
              </div>
              <div>
                This is a thread of {project.title}{'\'s'} updates on <a className='text-green-600' href='https://dublin-development.icitywork.com' target='_blank' rel="noreferrer">Dublin Devlopment Projects Site</a>
              </div>
            <div className='py-2'>
              {[project.title, 'DublinCA', 'California', 'TriValley'].map(i => {
                return <span key={i} className='py-1 px-2 bg-green-400 m-1 rounded-full text-xs text-green-800 bg-opacity-40'>#{i}</span>
              })}
            </div>
            <div className='text-sm'>
              Updated every 15 minutes
            </div>
          </div>
          {<RenderThreads project={project} />}
      </div>
    </>)
  }
}
