import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useState } from 'react'
import { useProjectProfileStore } from '@/stores'
import Map, { Marker } from 'react-map-gl'
import { MapPinIcon, InboxStackIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline'
import './style.scss'

export default function ProjectBento ({ projectId }) {
  const [project, setProject] = useState({})
  const projectProfile = useProjectProfileStore((state) => state.profiles[projectId])

  useEffect(() => {
    console.log(projectProfile)
    if (projectProfile)setProject(projectProfile)
  }, [projectProfile])

  const renderApplicant = (project) => {
    const applicant = project?.details.Applicant
    if (!applicant.name) return <></>

    const name = applicant.name
    const address = applicant.address
    const phone = applicant.phone
    return (<div className='flex items-center flex-col bento-card bg-gray-50 p-8 m-2'>
    <div>Applicant</div>
    <div className='text-2xl font-bold'>{name}</div>
    <div className='text-xl'>{address}</div>
    <div className='text-2xl opacity-60'>{phone}</div>
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
        console.log(k)
        return <></>
      }
    })}</div>
  }

  if (!project.id) {
    return (<div>Loading...</div>)
  } else {
    return (<div className=''>
      <div className='flex flex-col md:flex-row'>
        <div className='bento-card bg-gray-50 flex p-8 flex-col m-2'>
          <div className='flex flex-col justify-between h-full'>
            <div className='text-4xl font-bold'>{project.title}</div>
            <div className='opacity-50'>@{project.id}</div>
        </div>
        </div>
        <div className='bento-card overflow-scroll bg-gray-50 flex p-8 flex-col m-2'>
        <div className='flex flex-col justify-between h-full'>
          <div className='mb-8 text-lg opacity-80'>{project.description}</div>
          <div>
            <div className='pb-2'>
              <div className='flex items-center'><MapPinIcon className='h-4 w-4 inline mr-2' />{project.location}</div>
            </div>
            <div className='pb-2'>
              <div className='flex items-center'><InboxStackIcon className='h-4 w-4 inline mr-2' />Submitted on {project.details['Application Submittal Date']}</div>
            </div>
            <div className='pb-2'>
              <div className='flex items-center'><Square3Stack3DIcon className='h-4 w-4 inline mr-2' />{project.details['Project Area']}</div>
            </div>
          </div>
        </div>
        <div>
        </div>
        </div>
        <div className='bento-card border-2 w-full overflow-hidden md:h-auto h-[300px] m-2'>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: project?.geolocation?.lon,
          latitude: project?.geolocation?.lat,
          zoom: 14
        }}
        minZoom={14}
        style={{ borderRadius: '12px', height: '100%' }}
        mapStyle="mapbox://styles/amazingandyyy/clkj48ygk004o01r27gz8dub3"
      >
        {project?.geolocation?.lon && <Marker key={project.title} longitude={project?.geolocation?.lon} latitude={project?.geolocation?.lat}>
          <a href={`https://www.google.com/maps/place/${project?.geolocation?.lat},${project?.geolocation?.lon}`} target='_blank' rel='noreferrer'>
          <div className='flex flex-col text-white items-center' id='single-map-marker'>
            <div className='text-center leading-5 hover:scale-110 text-l bg-gradient-to-r from-emerald-500 to-lime-600 shadow-xl text-lg py-1 px-4 rounded-full font-semibold'>{project.location}</div>
            <div className='bg-gradient-to-r from-emerald-500 to-lime-600 w-1 h-4 shadow-2xl'></div>
          </div>
          </a>
        </Marker>}
      </Map>
        </div>
      </div>
      <div className='flex flex-col md:flex-row'>
        <div className='flex flex-row bento-card bg-gray-50 p-8 m-2'>
            {renderProjectDetails(project)}
        </div>
        {renderApplicant(project)}
      </div>

    </div>)
  }
}
