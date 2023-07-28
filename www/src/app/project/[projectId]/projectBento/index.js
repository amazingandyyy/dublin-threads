import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useState } from 'react'
import { useProjectProfileStore } from '@/stores'
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
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'
import './style.scss'
import { MapPinIcon } from '@heroicons/react/20/solid'
import { timeSince } from '@/utils'

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
    // https://www.linkedin.com/search/results/all/?keywords=Jerry%20Hunt%2C%20Rubicon%20Property%20Group&sid=Qwm
    return (<div className='flex flex-col md:rounded-2xl bento-card bg-gray-50 p-8 md:m-2'>
      <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3'>Applicant</div>
      <div>
        <div className='text-xl font-bold my-2'>{name}</div>
        <a href={`https://www.google.com/maps/place/${address.split(' ').join('+')}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
          <OutlineMapPinIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{address}</div>
        </a>
        <div className='text-md flex items-center pb-2'>
          <PhoneIcon className='h-4 w-4 inline mr-2' /><div>{phone}</div>
        </div>
        <a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
          <LinkIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>LinkedIn</div>
        </a>
        <a href={`https://www.google.com/search?q=${encodeURIComponent(name)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
          <LinkIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>Google Search</div>
        </a>
      </div>
    </div>)
  }
  const renderStats = (project) => {
    // https://www.linkedin.com/search/results/all/?keywords=Jerry%20Hunt%2C%20Rubicon%20Property%20Group&sid=Qwm
    return (<div className='flex flex-col md:rounded-2xl bento-card bg-gray-50 p-8 md:m-2'>
    <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3'>Statistics</div>
    <div className='pt-4'>
      <div className='text-md flex items-center pb-2'>
        <PhotoIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{project?.images?.length} images</div>
      </div>
      <div className='text-md flex items-center pb-2'>
        <DocumentPlusIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{project?.docs?.length} documents</div>
      </div>
      <div className='text-md flex items-center pb-2'>
        <ChatBubbleBottomCenterTextIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{project?.threads?.length} updates</div>
      </div>
    </div>
    </div>)
  }
  const renderProjectPlanner = (project) => {
    const person = project?.details['Project Planner']
    if (!person.name) return <></>

    const name = person.name
    const email = person.email
    const phone = person.phone
    // https://www.linkedin.com/search/results/all/?keywords=Jerry%20Hunt%2C%20Rubicon%20Property%20Group&sid=Qwm
    return (<div className='flex flex-col md:rounded-2xl bento-card bg-gray-50 p-8 md:m-2'>
    <div className='self-start border-2 border-gray-800 text-gray-800 text-sm rounded-full px-3'>Project Planner</div>
    <div>
      <div className='text-xl font-bold my-2'>{name}</div>
      <div className='text-md flex items-center pb-2'>
        <InboxIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>{email}</div>
      </div>
      <div className='text-md flex items-center pb-2'>
        <PhoneIcon className='h-4 w-4 inline mr-2' /><div>{phone}</div>
      </div>
      <a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(`${name} ${email}`)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
        <LinkIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>LinkedIn</div>
      </a>
      <a href={`https://www.google.com/search?q=${encodeURIComponent(`${name} ${email} ${phone}`)}`} target='_blank' rel='noreferrer' className='text-md flex items-center pb-2'>
        <LinkIcon className='h-4 w-4 inline mr-2' /><div className='hover:opacity-70 active:opacity-90'>Google Search</div>
      </a>
    </div>
    </div>)
  }
  const renderSubmittalDate = (project) => {
    const date = project?.details['Application Submittal Date']
    const dateArr = date.split('/')
    const standardDate = new Date(`${dateArr[2]}-${dateArr[0]}-${dateArr[1]}T00:00:00.000Z`)
    const seconds = standardDate.getTime() // 1440516958

    return (<div className='flex flex-col md:rounded-2xl bento-card bg-gray-50 p-8 md:m-2 h-full text-center items-center justify-center'>
      <div className='flex flex-col items-center'>
        <ClockIcon className='w-6 h-6 text-emerald-500' />
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600'>Submitted</div>
        <div className='text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 py-2 font-extralight'>{timeSince(seconds)}</div>
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 py-2'>ago on {date}</div>
      </div>
    </div>)
  }
  const renderStatus = (project) => {
    const status = project?.status
    return (<div className='md:rounded-2xl bento-card bg-gray-50 md:m-2 h-full bg-gradient-to-r from-emerald-500 to-lime-600 p-1 '>
    <div className='flex flex-col bg-white p-8 h-full w-full md:rounded-xl text-white items-center text-center justify-center'>
      <div className='justify-center'>
        <div className='text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600'>Current Status</div>
        <div className='text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-600 font-extrabold'>{status}</div>
      </div>
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
        console.log(k)
        return <></>
      }
    })}</div>
  }

  if (!project.id) {
    return (<div>Loading...</div>)
  } else {
    return (<div className=''>
      <div className='flex flex-col md:flex-row items-stretch'>
        <div className='md:rounded-2xl bento-card bg-gray-50 flex p-8 flex-col md:m-2'>
          <div className='flex flex-col justify-between h-full'>
            <div className='text-4xl font-bold'>{project.title}</div>
            <div className='opacity-50'>@{project.id}</div>
        </div>
        </div>
        <div className='md:rounded-2xl bento-card overflow-scroll bg-gray-50 flex p-8 flex-col md:m-2'>
        <div className='flex flex-col justify-between h-full'>
          <div className='mb-8 text-lg opacity-80'>{project.description}</div>
          <div>
              <div className='flex items-center pb-2'><BuildingLibraryIcon className='h-4 w-4 inline mr-2' />{project.details['Planning Application #']}</div>
                {/* <div className='flex items-center'><InboxStackIcon className='h-4 w-4 inline mr-2' />Submitted on {project.details['Application Submittal Date']}</div> */}
              <div className='flex items-center pb-2'><InboxStackIcon className='h-4 w-4 inline mr-2' />{project.details['Application Type']}</div>
                {/* <div className='flex items-center'><Square3Stack3DIcon className='h-4 w-4 inline mr-2' />{project.details['Project Area']}</div> */}
              <div className='flex items-center pb-2'><Square3Stack3DIcon className='h-4 w-4 inline mr-2' />{project.details['General Plan Land Use']}</div>
          </div>
        </div>
        <div>
        </div>
        </div>
        <div className='md:rounded-2xl bento-card border-2 w-auto md:w-full overflow-hidden md:h-auto h-[300px] md:m-2'>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: project?.geolocation?.lon,
          latitude: project?.geolocation?.lat,
          zoom: 14
        }}
        // minZoom={14}
        style={{ borderRadius: '12px', height: '100%' }}
        mapStyle="mapbox://styles/amazingandyyy/clkj48ygk004o01r27gz8dub3"
      >
        {project?.geolocation?.lon && <Marker key={project.title} longitude={project?.geolocation?.lon} latitude={project?.geolocation?.lat}>
          <a href={`https://www.google.com/maps/place/${project?.geolocation?.lat},${project?.geolocation?.lon}`} target='_blank' rel='noreferrer'>
          <div className='flex flex-col text-white items-center' id='single-map-marker'>
            <div className='flex items-center text-center leading-5 hover:scale-110 text-l bg-gradient-to-r from-emerald-500 to-lime-600 shadow-xl text-lg py-1 px-4 rounded-full font-semibold'>
              <MapPinIcon className='h-4 w-4 inline mr-1' />
              <div>{project.location}</div>
            </div>
            <div className='bg-gradient-to-r from-emerald-500 to-lime-600 w-1 h-4 shadow-2xl'></div>
          </div>
          </a>
        </Marker>}
      </Map>
        </div>
      </div>
      <div className='flex flex-col md:flex-row items-stretch'>
        <div className='flex flex-row md:rounded-2xl bento-card bg-gray-50 p-8 md:m-2'>
            {renderProjectDetails(project)}
        </div>
        <div className='flex flex-col'>
          {renderStatus(project)}
          {renderSubmittalDate(project)}
        </div>
        <div className='flex flex-col'>
          {renderStats(project)}
          {renderApplicant(project)}
          {renderProjectPlanner(project)}
        </div>
      </div>

    </div>)
  }
}
