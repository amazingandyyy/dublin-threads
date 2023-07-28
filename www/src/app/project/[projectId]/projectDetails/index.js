import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useState } from 'react'
import { useProjectProfileStore } from '@/stores'
import Map, { Marker } from 'react-map-gl'
import { MapPinIcon, InboxStackIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline'
import './style.scss'

export default function ProjectDetails ({ projectId }) {
  const [project, setProject] = useState({})
  const projectProfile = useProjectProfileStore((state) => state.profiles[projectId])

  useEffect(() => {
    console.log(projectProfile)
    if (projectProfile)setProject(projectProfile)
  }, [projectProfile])

  return (project.id
    ? <div className='bg-gray-50 rounded-xl flex max-w-[750px] w-full p-4 flex-col'>
    <div className='pb-2 flex flex-col md:flex-row md:items-center'>
      <div>
        <h1 className='text-xl font-bold'>{project.title}</h1>
        <p className='opacity-50'>@{project.id}</p>
      </div>
      <div className='bg-black inline-block text-white text-md py-1 px-3 md:ml-2 my-2 font-bold rounded-full'>{project.status}</div>
    </div>
    <div>
      <div className='mb-2'>{project.description}</div>
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
    <div>
    <div className='border-2 rounded-xl w-full overflow-hidden h-[400px]'>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: project?.geolocation?.lon,
          latitude: project?.geolocation?.lat,
          zoom: 14
        }}
        maxZoom={18}
        minZoom={14}
        style={{ borderRadius: '12px', height: '100%' }}
        mapStyle="mapbox://styles/amazingandyyy/clkj48ygk004o01r27gz8dub3"
      >
        {project?.geolocation?.lon && <Marker key={project.title} longitude={project?.geolocation?.lon} latitude={project?.geolocation?.lat}>
          <a href={`https://www.google.com/maps/place/${project?.geolocation?.lat},${project?.geolocation?.lon}`} target='_blank' rel='noreferrer'>
          <div className='flex flex-col items-center' id='single-map-marker'>
            <div className='obsolute text-lg bg-white text-green-900 shadow-xl py-1 px-4 rounded-full font-semibold'>{project.title}</div>
            <div className='obsolute bottom-0 bg-white w-1 h-4 shadow-2xl'></div>
          </div>
          </a>
        </Marker>}
      </Map>
      </div>
    </div>
    <div className='py-4'>
        <h2 className='text-md uppercase font-bold tracking-wider'>Details</h2>
      </div>
  </div>
    : <div>Loading</div>)
}
