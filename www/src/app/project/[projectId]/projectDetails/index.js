import { useEffect, useState } from 'react'
import { useProjectProfileStore } from '@/stores'
import Map, { Marker } from 'react-map-gl'
import { PinMarker } from '../../../map/markers'
import { MapPinIcon, InboxStackIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline'

export default function ProjectDetails ({ projectId }) {
  const [project, setProject] = useState({})
  const projectProfile = useProjectProfileStore((state) => state.profiles[projectId])

  useEffect(() => {
    console.log(projectProfile)
    if (projectProfile)setProject(projectProfile)
  }, [projectProfile])

  return (project.id
    ? <div className='flex flex-col'>
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
    {project?.geolocation?.lon && <div className='border-2 rounded-xl w-full h-[300px]'>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: project?.geolocation?.lon,
          latitude: project?.geolocation?.lat,
          zoom: 12
        }}
        style={{ borderRadius: '12px', height: '300px' }}
        mapStyle="mapbox://styles/amazingandyyy/clkj48ygk004o01r27gz8dub3"
      >
        <Marker longitude={project?.geolocation?.lon} latitude={project?.geolocation?.lat}>
          <PinMarker iconName={project?.geolocation?.iconName || 'dot'} />
        </Marker>
    </Map>
      </div>}
    </div>
  </div>
    : <div>Loading</div>)
}
