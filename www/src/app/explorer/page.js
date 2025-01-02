'use client'
import { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useProjectProfileStore, useThreadStore } from '@/stores'
import GlobalHeader from '@/header'
import { fetchDevelopments } from '@/utils'
import Link from 'next/link'
import { MapIcon, ListBulletIcon, StarIcon, ShareIcon, ChatBubbleLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline'
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
  const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setIsLoading(false)
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

    const statusColors = {
      'Pre-Application': 'bg-emerald-500',
      'Application Under Review': 'bg-blue-500',
      'Planning Application Submitted': 'bg-yellow-500',
      'Final Action': 'bg-purple-500',
      'Public Hearing': 'bg-red-500'
    }

    return (
      <div className="relative w-full h-[calc(100vh-200px)] rounded-xl overflow-hidden bg-white">
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
                anchor="center"
              >
                <Link href={`/project/${project.id}`}>
                  <div className="relative group">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <div className="bg-white rounded-lg py-1.5 px-2.5 shadow-lg min-w-[120px]">
                        <p className="text-xs font-medium text-gray-900 line-clamp-2">{project.title}</p>
                        {project.status && (
                          <p className="text-[10px] text-gray-500 mt-0.5">{project.status}</p>
                        )}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'Pre-Application' ? 'bg-emerald-500' :
                      project.status === 'Application Under Review' ? 'bg-blue-500' :
                      project.status === 'Planning Application Submitted' ? 'bg-yellow-500' :
                      project.status === 'Final Action' ? 'bg-purple-500' :
                      project.status === 'Public Hearing' ? 'bg-red-500' :
                      'bg-gray-400'
                    } ring-2 ring-white shadow-md hover:scale-150 transition-transform duration-300`} />
                  </div>
                </Link>
              </Marker>
            )
          ))}
        </Map>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg py-2 px-3">
          <h4 className="text-xs font-medium text-gray-900 mb-1.5">Status Colors</h4>
          <div className="space-y-1.5">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
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

  const LoadingState = () => (
    <div className="w-full max-w-4xl mx-auto">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl p-6 h-24"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl p-6 h-48"></div>
          ))}
        </div>
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-12">
      <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
      <p className="text-gray-500">Try adjusting your filters or search terms</p>
    </div>
  )

  return (
    <>
      <GlobalHeader />
      {shareProject && <SharePopup project={shareProject} onClose={() => setShareProject(null)} />}
      <main className="pt-16 h-full bg-gray-100">
        <div className="container mx-auto px-3 sm:px-4 py-8">
          <div className="flex flex-col items-center mt-12 text-center space-y-6 mb-12">
            <h1 className="font-handwriting text-3xl sm:text-4xl md:text-7xl font-bold text-green-950 tracking-wide">
              Explorer
            </h1>

            {/* Statistics Overview */}
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.total}</p>
                  <h3 className="text-xs sm:text-sm text-gray-600 mt-1">Total Projects</h3>
                </div>
                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.byStatus['Under Construction'] || 0}</p>
                  <h3 className="text-xs sm:text-sm text-gray-600 mt-1">Under Construction</h3>
                </div>
                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.byMonth[Object.keys(stats.byMonth).sort().pop()] || 0}</p>
                  <h3 className="text-xs sm:text-sm text-gray-600 mt-1">Recently Added</h3>
                </div>
                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{followedProjects.length}</p>
                  <h3 className="text-xs sm:text-sm text-gray-600 mt-1">Being Followed</h3>
                </div>
              </div>

              {/* Status Distribution */}
              <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Status Distribution</h3>
                <div className="relative pt-2 pb-2">
                  {/* Distribution Bar */}
                  <div className="relative h-2 bg-gray-200/70 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {[
                        { status: 'Application Under Review', color: 'bg-blue-500' },
                        { status: 'Pre-Application', color: 'bg-green-500' },
                        { status: 'Planning Application Submitted', color: 'bg-yellow-500' },
                        { status: 'Final Action', color: 'bg-purple-500' },
                        { status: 'Public Hearing', color: 'bg-red-500' },
                        { status: 'Unknown', color: 'bg-gray-500' }
                      ].map((item) => {
                        const count = stats.byStatus[item.status] || 0
                        const percentage = (count / stats.total) * 100
                        return (
                          <div
                            key={item.status}
                            className={`relative h-full ${item.color} group cursor-pointer transition-all duration-300 hover:brightness-110`}
                            style={{ width: `${percentage}%` }}
                            onClick={() => setStatusFilter(statusFilter === item.status ? '' : item.status)}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 transform -translate-y-1 group-hover:translate-y-0">
                              <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-lg py-2 px-3 shadow-xl">
                                <div className="font-medium text-xs mb-0.5">{item.status}</div>
                                <div className="text-[10px] text-gray-300 font-medium">
                                  {count} projects ({percentage.toFixed(1)}%)
                                </div>
                                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900/95"></div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="w-full max-w-4xl flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search projects by title, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1 lg:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-4 pr-8 py-2.5 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer text-sm"
                  >
                    <option value="">All Statuses</option>
                    {Object.keys(stats.byStatus).sort().map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="relative flex-1 lg:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-4 pr-8 py-2.5 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="status">Sort by Status</option>
                    <option value="followed">Followed First</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">List</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                    viewMode === 'map'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Map</span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : highlights.length === 0 ? (
            <EmptyState />
          ) : viewMode === 'map' ? (
            <div className="w-full max-w-4xl mx-auto">
              {renderMap()}
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid gap-4">
          {highlights.map((project) => (
            <div
              key={project.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-green-200"
            >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <Link
                href={`/project/${project.id}`}
                        className="group flex-1"
              >
                        <div className="flex flex-col">
                          <h2 className="font-semibold text-lg text-gray-900 group-hover:text-green-700 transition-colors duration-300 line-clamp-2">
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
                          </div>
                          {project.description && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2 group-hover:text-gray-900 transition-colors duration-300">
                              {project.description}
                            </p>
                          )}
                        </div>
              </Link>
                      <div className="flex items-center gap-2 self-start">
                        <button
                          onClick={() => setShareProject(project)}
                          className="p-2 rounded-full hover:bg-green-50 transition-colors duration-300"
                        >
                          <ShareIcon className="w-5 h-5 text-gray-400 hover:text-green-600" />
                        </button>
                        <button
                          onClick={() => toggleFollow(project.id)}
                          className="p-2 rounded-full hover:bg-green-50 transition-colors duration-300"
                        >
                          {followedProjects.includes(project.id) ? (
                            <StarIconSolid className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="mt-4">
                      <div className="flex justify-between mb-2 text-[10px] sm:text-xs font-medium text-gray-500">
                        <span>Pre-Application</span>
                        <span>Under Review</span>
                        <span>Submitted</span>
                        <span>Public Hearing</span>
                        <span>Final Action</span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                          style={{
                            width: (() => {
                              const status = project.status || ''
                              if (status === 'Final Action') return '100%'
                              if (status === 'Public Hearing') return '80%'
                              if (status === 'Planning Application Submitted') return '60%'
                              if (status === 'Application Under Review') return '40%'
                              if (status === 'Pre-Application') return '20%'
                              return '0%'
                            })()
                          }}
                        />
                      </div>
                    </div>

              {project.images && project.images.length > 0 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {project.images.slice(0, 5).map((image, index) => (
                    <Link
                      key={`${project.id}-${index}`}
                      href={`/project/${project.id}`}
                            className="shrink-0 transition-transform duration-300 hover:scale-105"
                    >
                      <Image
                        src={image.thumbnail}
                              className="rounded-lg w-20 sm:w-24 h-20 sm:h-24 object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
                      />
                    </Link>
                  ))}
                </div>
              )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        {project.threads?.length > 0 && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                            <span className="text-xs">{project.threads.length} updates</span>
                          </div>
                        )}
                        <time className="text-xs text-gray-400">
                          {project.details['Application Submittal Date']}
                        </time>
                      </div>
                      <Link
                        href={`/project/${project.id}#comments`}
                        className="text-green-600 text-xs sm:text-sm hover:text-green-700 transition-colors duration-300"
                      >
                        View Discussion →
                      </Link>
                    </div>
            </div>
          ))}
        </div>
            </div>
          )}

      </div>
    </main>
    </>
  )
}
