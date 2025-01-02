'use client'
import { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useProjectProfileStore, useThreadStore } from '@/stores'
import GlobalHeader from '@/header'
import { fetchDevelopments } from '@/utils'
import Link from 'next/link'
import { MapIcon, ListBulletIcon, StarIcon, ShareIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon
} from 'react-share'

function getSeconds (date) {
  const dateArr = date.split('/')
  const standardDate = new Date(`${dateArr[2]}-${dateArr[0]}-${dateArr[1]}T00:00:00.000Z`)
  const seconds = standardDate.getTime() // 1440516958
  return seconds
}

function Image ({ src, className }) {
  const [show, setShow] = useState(true)
  return show && <img src={src} className={className} loading='lazy' onError={() => setShow(false)} />
}

export default function Threads ({ params, searchParams }) {
  const projects = useProjectProfileStore(state => state.profiles)
  const [highlights, setHighlights] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('list')
  const [mapToken, setMapToken] = useState('')
  const [followedProjects, setFollowedProjects] = useState([])
  const [viewState, setViewState] = useState({
    longitude: -121.909645,
    latitude: 37.714861,
    zoom: 12
  })
  const [shareProject, setShareProject] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {},
    byType: {},
    byMonth: {}
  })

  useEffect(() => {
    // Get Mapbox token
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('Mapbox token is missing')
      return
    }
    setMapToken(token)
  }, [])

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

    // Filter projects based on search query and status
    const filtered = r.filter(project => {
      const matchesSearch = searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === '' ||
        project.status?.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })

    // Sort projects based on selected sorting option
    filtered.sort((a, b) => {
      const aFollowed = followedProjects.includes(a.id)
      const bFollowed = followedProjects.includes(b.id)
      
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'status':
          return (a.status || '').localeCompare(b.status || '')
        case 'followed':
          if (aFollowed === bFollowed) {
            return getSeconds(b.details['Application Submittal Date']) - getSeconds(a.details['Application Submittal Date'])
          }
          return bFollowed ? 1 : -1
        case 'date':
        default:
          return getSeconds(b.details['Application Submittal Date']) - getSeconds(a.details['Application Submittal Date'])
      }
    })

    setHighlights(filtered)
  }, [projects, searchQuery, statusFilter, sortBy, followedProjects])

  useEffect(() => {
    // Load followed projects from localStorage
    const saved = localStorage.getItem('followedProjects')
    if (saved) {
      setFollowedProjects(JSON.parse(saved))
    }
  }, [])

  const toggleFollow = (projectId) => {
    setFollowedProjects(prev => {
      const newFollowed = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
      localStorage.setItem('followedProjects', JSON.stringify(newFollowed))
      return newFollowed
    })
  }

  const renderMap = () => {
    if (!mapToken) return null

    return (
      <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-sm">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={mapToken}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
        >
          {highlights.map((project) => (
            project?.geolocation?.lon && project?.geolocation?.lat && (
              <Marker
                key={project.id}
                longitude={project.geolocation.lon}
                latitude={project.geolocation.lat}
                anchor="bottom"
              >
                <Link href={`/project/${project.id}`}>
                  <div className="flex flex-col items-center">
                    <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium shadow-lg hover:bg-green-600 transition-all duration-300">
                      {project.title}
                    </div>
                    <div className="w-1 h-4 bg-green-500"></div>
                  </div>
                </Link>
              </Marker>
            )
          ))}
        </Map>
      </div>
    )
  }

  const SharePopup = ({ project, onClose }) => {
    if (!project) return null
    const shareUrl = `https://dublin.amazyyy.com/project/${project.id}`
    const title = `Check out this Dublin development project: ${project.title}`

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl font-semibold mb-4">Share this project</h3>
          <div className="flex justify-center gap-4 mb-6">
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={title}>
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
            <EmailShareButton url={shareUrl} subject={title}>
              <EmailIcon size={40} round />
            </EmailShareButton>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm"
              onClick={e => e.target.select()}
            />
            <button
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate statistics
  useEffect(() => {
    const newStats = {
      total: highlights.length,
      byStatus: {},
      byType: {},
      byMonth: {}
    }

    highlights.forEach(project => {
      // Count by status
      const status = project.status || 'Unknown'
      newStats.byStatus[status] = (newStats.byStatus[status] || 0) + 1

      // Count by type
      const type = project.details['Application Type'] || 'Unknown'
      newStats.byType[type] = (newStats.byType[type] || 0) + 1

      // Count by month
      const date = project.details['Application Submittal Date']
      if (date) {
        const month = date.split('/').slice(0, 2).join('/')
        newStats.byMonth[month] = (newStats.byMonth[month] || 0) + 1
      }
    })

    console.log('Project Statuses:', Object.keys(newStats.byStatus))
    setStats(newStats)
  }, [highlights])

  const StatCard = ({ title, value, color = 'green' }) => (
    <div className={`bg-${color}-50 rounded-xl p-4 flex flex-col items-center justify-center`}>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  )

  return (<>
    <GlobalHeader />
    {shareProject && <SharePopup project={shareProject} onClose={() => setShareProject(null)} />}
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className='container mx-auto px-3 sm:px-4 py-8 sm:py-16'>
        <div className='flex flex-col items-center mt-12 text-center space-y-4 sm:space-y-6 mb-8 sm:mb-16'>
          <h1 className='font-handwriting text-3xl sm:text-4xl md:text-7xl font-bold text-green-950 tracking-wide'>
            Explorer
          </h1>
          
          {/* Statistics Overview */}
          <div className="w-full max-w-4xl bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Project Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Projects" value={stats.total} />
              <StatCard
                title="Under Construction"
                value={stats.byStatus['Under Construction'] || 0}
                color="blue"
              />
              <StatCard
                title="Recently Added"
                value={stats.byMonth[Object.keys(stats.byMonth).sort().pop()] || 0}
                color="purple"
              />
              <StatCard
                title="Being Followed"
                value={followedProjects.length}
                color="yellow"
              />
            </div>
            
            {/* Status Distribution */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Status Distribution</h3>
              <div className="flex h-4 rounded-full overflow-hidden">
                {Object.entries(stats.byStatus).map(([status, count], index) => {
                  const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500']
                  const percentage = (count / stats.total) * 100
                  return (
                    <div
                      key={status}
                      className={`${colors[index % colors.length]} relative group cursor-help`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {status}: {count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <p className='text-gray-600 text-base sm:text-lg max-w-2xl px-2'>
            This is an <span className='font-medium text-green-800'>experimental feature</span>. Currently under active development
          </p>
          
          {/* Search and Filter Section */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">All Statuses</option>
                  {Object.keys(stats.byStatus)
                    .sort()
                    .map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))
                  }
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="status">Sort by Status</option>
                  <option value="followed">Followed First</option>
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-green-800 hover:bg-green-100'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-green-800 hover:bg-green-100'
                }`}
              >
                <MapIcon className="w-5 h-5" />
                Map View
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'map' ? (
          renderMap()
        ) : (
          <div className='grid gap-4 sm:gap-8 md:gap-12'>
            {highlights.map((project) => (
              <div
                key={project.id}
                className='bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6'
              >
                <div className="flex justify-between items-start mb-3">
                  <Link
                    href={`/project/${project.id}`}
                    className='group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2'
                  >
                    <div className="flex flex-col">
                      <h2 className='font-semibold text-lg sm:text-xl text-green-950 group-hover:text-green-700 transition-colors duration-300 line-clamp-2'>
                        {project.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.status && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {project.status}
                          </span>
                        )}
                        {project.details['Application Type'] && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {project.details['Application Type']}
                          </span>
                        )}
                        {project.details['General Plan Land Use'] && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {project.details['General Plan Land Use']}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <time className='text-xs sm:text-sm text-gray-400 shrink-0'>
                        {project.details['Application Submittal Date']}
                      </time>
                      {project.location && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapIcon className="w-4 h-4" />
                          {project.location}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShareProject(project)}
                      className="p-2 rounded-full hover:bg-green-50 transition-colors duration-300"
                    >
                      <ShareIcon className="w-6 h-6 text-gray-400 hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => toggleFollow(project.id)}
                      className="p-2 rounded-full hover:bg-green-50 transition-colors duration-300"
                    >
                      {followedProjects.includes(project.id)
                        ? (
                          <StarIconSolid className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <StarIcon className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
                        )
                      }
                    </button>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="mt-4 mb-6">
                  <div className="flex justify-between mb-2 text-xs text-gray-500">
                    <span>Application</span>
                    <span>Review</span>
                    <span>Approval</span>
                    <span>Construction</span>
                    <span>Complete</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: (() => {
                          const status = project.status?.toLowerCase() || ''
                          if (status.includes('complete')) return '100%'
                          if (status.includes('construction')) return '75%'
                          if (status.includes('approve')) return '50%'
                          if (status.includes('review') || status.includes('pending')) return '25%'
                          if (status.includes('submit') || status.includes('application')) return '10%'
                          return '0%'
                        })()
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    {project.threads?.length > 0 && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                        <span className="text-sm">{project.threads.length} updates</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/project/${project.id}#comments`}
                    className="text-green-600 text-sm hover:text-green-700 transition-colors duration-300"
                  >
                    View Discussion →
                  </Link>
                </div>

                {project.images && project.images.length > 0 && (
                  <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                    {project.images.slice(0, 5).map((image, index) => (
                      <Link
                        key={`${project.id}-${index}`}
                        href={`/project/${project.id}`}
                        className='block transition-transform duration-300 hover:scale-105'
                      >
                        <Image
                          src={image.thumbnail}
                          className='rounded-lg sm:rounded-xl w-24 sm:w-32 h-24 sm:h-32 object-cover shadow-sm hover:shadow-md transition-shadow duration-300'
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className='text-center text-gray-500 mt-8 sm:mt-12 italic text-sm sm:text-base'>
          more to come...
        </div>
      </div>
    </main>
  </>)
}
