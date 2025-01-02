'use client'

import GlobalHeader from '@/header'
import { 
  MapPin, Building2, FileText, Phone, Mail, Clock, Link,
  CalendarDays, SquareStack, Users, ChevronRight, ExternalLink,
  Building, Scale, Car, Globe2, ImageIcon
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useProjectProfileStore, useThreadStore } from '@/stores'
import { fetchDevelopments, timeSince } from '@/utils'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon as XIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share'

const ValueChange = ({ oldText, newText, type = 'text' }) => {
  const processText = (text) => {
    if (type === 'phone') return text
    if (type === 'measurement') return text
    return text
  }

  const oldValue = processText(oldText || '')
  const newValue = processText(newText || '')

  return (
    <div className="space-y-2 group">
      <div className="flex items-baseline gap-4">
        <div className="w-24 flex-shrink-0">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">Previous</span>
        </div>
        <div className="text-gray-600 group-hover:text-gray-900 transition-colors">{oldValue || 'Not set'}</div>
      </div>
      <div className="flex items-baseline gap-4">
        <div className="w-24 flex-shrink-0">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">New</span>
        </div>
        <div className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">{newValue}</div>
      </div>
    </div>
  )
}

const TimelineEvent = ({ event }) => {
  const getIcon = () => {
    switch (event.type) {
      case 'submit':
        return <FileText className="w-4 h-4 text-emerald-500" />
      case 'status':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'detail':
        return <Building2 className="w-4 h-4 text-purple-500" />
      case 'description':
        return <FileText className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getEventColor = () => {
    switch (event.type) {
      case 'submit':
        return 'bg-emerald-100 text-emerald-800'
      case 'status':
        return 'bg-blue-100 text-blue-800'
      case 'detail':
        return 'bg-purple-100 text-purple-800'
      case 'description':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative pl-10 group">
      {/* Timeline dot */}
      <div className="absolute left-0 w-[32px] h-[32px] rounded-full bg-gradient-to-r from-emerald-500 to-lime-600 p-[2px] transition-transform group-hover:scale-110">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center transition-colors group-hover:bg-gray-50">
          {getIcon()}
        </div>
      </div>
      
      {/* Content */}
      <div className="bg-gray-50 rounded-lg p-4 transition-all duration-200 group-hover:bg-white group-hover:shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-emerald-600 font-medium">
            {new Date(event.timestamp).toLocaleDateString()}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getEventColor()} transition-transform group-hover:scale-105`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{event.title}</h3>
        
        {event.type === 'description' && (
          <div className="mt-3">
            <ValueChange oldText={event.oldValue} newText={event.newValue} />
          </div>
        )}
        
        {event.type === 'detail' && (
          <div className="mt-3 space-y-4">
            {event.changes.map((change, idx) => (
              <div key={idx}>
                <div className="text-sm font-medium text-gray-700 mb-2">{change.field}</div>
                <ValueChange oldText={change.oldValue} newText={change.newValue} />
              </div>
            ))}
          </div>
        )}
        
        {event.type === 'status' && (
          <div className="mt-3">
            <ValueChange oldText={event.oldValue} newText={event.newValue} />
          </div>
        )}
      </div>
    </div>
  )
}

const InfoTooltip = ({ text }) => (
  <div className="group relative inline-block ml-1">
    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs cursor-help">?</div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
)

const MetricCard = ({ icon: Icon, label, value, tooltip, trend }) => {
  const trendColor = trend?.positive ? 'text-emerald-600' : 'text-red-600'
  const trendArrow = trend?.positive ? '↑' : '↓'
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
        </div>
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{label}</h3>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {trend && (
        <div className={`text-xs sm:text-sm ${trendColor} flex items-center gap-1`}>
          {trendArrow} {trend.text}
        </div>
      )}
    </div>
  )
}

const CardHeader = ({ icon: Icon, title, color = 'emerald' }) => (
  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
    <div className={`p-1.5 sm:p-2 bg-${color}-50 rounded-lg`}>
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${color}-600`} />
    </div>
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h2>
  </div>
)

const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 sm:p-8 ${
    hover ? 'hover:shadow-md transition-shadow duration-200' : ''
  } ${className}`}>
    {children}
  </div>
)

const Badge = ({ children, color = 'emerald', className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800 ${className}`}>
    {children}
  </span>
)

const InfoBlock = ({ icon: Icon, label, value, subtext }) => (
  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors group">
    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 text-sm sm:text-base">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{subtext}</p>}
    </div>
  </div>
)

const LinkButton = ({ href, icon: Icon, children, color = 'emerald' }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`inline-flex items-center gap-2 text-sm text-gray-600 hover:text-${color}-600 transition-colors group`}
  >
    <Icon className={'w-4 h-4 transition-transform group-hover:translate-x-0.5'} />
    <span>{children}</span>
    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
  </a>
)

export default function Project ({ params }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        useThreadStore.getState().update(data)
        setLoading(false)
      })
  }, [])

  useProjectProfileStore.subscribe(() => {
    setProject(useProjectProfileStore.getState().current(params.projectId))
  })

  useEffect(() => {
    if (project) {
      document.title = `${project.title} - DublinThreads`
      document.description = project.description
      document.image = project.images?.[0]?.thumbnail
      document.url = `https://dublin.amazyyy.com/project/${project.id}`
      document.siteName = 'DublinThreads'
      document.type = 'website'
      document.locale = 'en_US'
    }
  }, [project])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F2EE]">
        <GlobalHeader />
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F3F2EE]">
        <GlobalHeader />
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Project not found</h1>
        </div>
      </div>
    )
  }

  const {
    title,
    description,
    status,
    location,
    details,
    images = [],
    geolocation,
    threads = [],
    docs = [],
    id
  } = project

  // Format submittal date
  const submittalDate = details['Application Submittal Date']
  const dateArr = submittalDate.split('/')
  const standardDate = new Date(`${dateArr[2]}-${dateArr[0]}-${dateArr[1]}T00:00:00.000Z`)
  const submittalSeconds = standardDate.getTime()

  const shareUrl = `https://dublin.amazyyy.com/project/${id}`

  const processTimelineEvents = (project) => {
    const events = []

    // Add initial submission
    events.push({
      type: 'submit',
      title: 'Project Submitted',
      timestamp: standardDate.getTime(),
      description: `Planning Application #${details['Planning Application #']} submitted`
    })

    // Process all operations from the project logs
    if (project.threads) {
      project.threads.forEach(thread => {
        const timestamp = parseInt(thread.timestamp)
        
        if (thread.op === 'update') {
          const updateType = thread.path?.[1]
          
          switch (updateType) {
            case 'status':
              events.push({
                type: 'status',
                title: 'Status Updated',
                timestamp,
                oldValue: thread.oldVal,
                newValue: thread.val
              })
              break
              
            case 'description':
              events.push({
                type: 'description',
                title: 'Description Updated',
                timestamp,
                oldValue: thread.oldVal,
                newValue: thread.val
              })
              break
              
            case 'details':
              events.push({
                type: 'detail',
                title: 'Project Details Updated',
                timestamp,
                changes: [{
                  field: thread.path[2],
                  oldValue: thread.oldVal,
                  newValue: thread.val
                }]
              })
              break
          }
        }
      })
    }

    // Sort by timestamp (newest first)
    return events.sort((a, b) => b.timestamp - a.timestamp)
  }

  const renderTimeline = () => {
    const events = processTimelineEvents(project)
    
    return (
      <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl font-semibold mb-6">Project Timeline</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-lime-600"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <TimelineEvent key={index} event={event} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const renderOverviewTab = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Project Description */}
      <Card>
        <CardHeader icon={FileText} title="Project Overview" />
        <p className="text-gray-600 leading-relaxed mb-8">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Application Details
              <Badge color="blue">Required</Badge>
            </h3>
            <div className="space-y-3">
              <InfoBlock
                icon={FileText}
                label="Application Number"
                value={details['Planning Application #']}
                subtext={`Submitted on ${submittalDate}`}
              />
              <InfoBlock
                icon={Globe2}
                label="Land Use"
                value={details['General Plan Land Use']}
                subtext="Zoning classification for development"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Project Specifications
              <Badge color="purple">Technical</Badge>
            </h3>
            <div className="space-y-3">
              <InfoBlock
                icon={SquareStack}
                label="Application Type"
                value={details['Application Type']}
                subtext="Type of development application"
              />
              <InfoBlock
                icon={Building2}
                label="Specific Plan Area"
                value={details['Specific Plan Area']}
                subtext="Development plan zone"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={Building}
          label="Project Area"
          value={details['Project Area']}
          tooltip="Total development area of the project"
          trend={{
            positive: true,
            text: 'Meets zoning requirements'
          }}
        />
        <MetricCard
          icon={Scale}
          label="Floor Area Ratio"
          value={details['Floor Area Ratio'] || 'N/A'}
          tooltip="Ratio of total floor area to lot size"
          trend={details['Floor Area Ratio']
            ? {
                positive: true,
                text: 'Within permitted limits'
              }
            : null}
        />
        <MetricCard
          icon={Car}
          label="Parking Spaces"
          value={details['Parking Provided'] || 'N/A'}
          tooltip="Number of parking spaces provided"
          trend={details['Parking Provided']
            ? {
                positive: true,
                text: 'Exceeds minimum requirement'
              }
            : null}
        />
      </div>

      {/* Location & Map */}
      {geolocation && (
        <Card>
          <CardHeader icon={MapPin} title="Location" />
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-gray-600 mb-4">{location}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <p className="text-sm text-gray-500 group-hover:text-gray-600">Latitude</p>
                    <p className="font-medium text-gray-900 group-hover:text-emerald-600">{geolocation.lat.toFixed(6)}°</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <p className="text-sm text-gray-500 group-hover:text-gray-600">Longitude</p>
                    <p className="font-medium text-gray-900 group-hover:text-emerald-600">{geolocation.lon.toFixed(6)}°</p>
                  </div>
                </div>
              </div>
              <LinkButton
                href={`https://www.google.com/maps/place/${geolocation.lat},${geolocation.lon}`}
                icon={ExternalLink}
                color="emerald"
              >
                View on Google Maps
              </LinkButton>
            </div>
            <div className="flex-1">
              <div className="h-[300px] rounded-lg overflow-hidden shadow-md">
                <Map
                  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                  initialViewState={{
                    longitude: geolocation.lon,
                    latitude: geolocation.lat,
                    zoom: 14
                  }}
                  style={{ height: '100%' }}
                  mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
                >
                  <Marker longitude={geolocation.lon} latitude={geolocation.lat}>
                    <div className="flex flex-col items-center transform hover:scale-110 transition-transform">
                      <div className="flex items-center text-center leading-5 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg text-lg py-1.5 px-4 rounded-full font-semibold text-white">
                        <MapPin className="h-4 w-4 mr-1" />
                        <div>{location}</div>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-1 h-4"></div>
                    </div>
                  </Marker>
                </Map>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Project Images */}
      {images.length > 0 && (
        <Card>
          <CardHeader icon={ImageIcon} title="Project Images" />
          <div className="grid grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div key={index} className="group relative">
                <div className="aspect-video relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={image.original}
                    alt={`Project image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium">View {index + 1} of {images.length}</p>
                    </div>
                  </div>
                </div>
                <a
                  href={image.original}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )

  const renderContactTab = () => (
    <div className="space-y-8">
      {/* Project Planner */}
      <Card>
        <CardHeader icon={Users} title="Project Planner" color="blue" />
        <div className="space-y-6">
          <div className="text-2xl font-bold text-gray-900">{details['Project Planner'].name}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={`tel:${details['Project Planner'].phone}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
            >
              <Phone className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium group-hover:text-blue-700">{details['Project Planner'].phone}</p>
              </div>
            </a>
            
            <a 
              href={`mailto:${details['Project Planner'].email}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium group-hover:text-blue-700">{details['Project Planner'].email}</p>
              </div>
            </a>
          </div>
          
          <div className="flex gap-4">
            <LinkButton
              href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(`${details['Project Planner'].name} ${details['Project Planner'].email}`)}`}
              icon={Link}
              color="blue"
            >
              Find on LinkedIn
            </LinkButton>
          </div>
        </div>
      </Card>

      {/* Applicant Information */}
      <Card>
        <CardHeader icon={Building2} title="Applicant" color="emerald" />
        <div className="space-y-6">
          <div className="text-2xl font-bold text-gray-900">{details.Applicant.name}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={`tel:${details.Applicant.phone}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 group"
            >
              <Phone className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium group-hover:text-emerald-700">{details.Applicant.phone}</p>
              </div>
            </a>
            
            <a 
              href={`https://www.google.com/maps/place/${details.Applicant.address.split(' ').join('+')}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 group"
            >
              <MapPin className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium group-hover:text-emerald-700">{details.Applicant.address}</p>
              </div>
            </a>
          </div>
          
          <div className="flex gap-4">
            <LinkButton
              href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(details.Applicant.name)}`}
              icon={Link}
              color="emerald"
            >
              Find on LinkedIn
            </LinkButton>
          </div>
        </div>
      </Card>

      {/* Documents */}
      {docs.length > 0 && (
        <Card>
          <CardHeader icon={FileText} title="Documents" color="orange" />
          <div className="grid grid-cols-1 gap-3">
            {docs.map((doc) => (
              <a
                key={doc.url}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 group"
              >
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-orange-700">{doc.name || 'Document'}</p>
                  <p className="text-sm text-gray-500">Click to view</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F3F2EE]">
      <GlobalHeader />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 md:py-16">
        <main className="max-w-[1400px] mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl mb-4">
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] group">
              {images[0] && (
                <Image
                  src={images[0].original}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 z-10" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 z-20 text-white w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-2 sm:mb-3 opacity-90">
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">
                    {status}
                  </span>
                  <span className="flex items-center gap-1 sm:gap-2 bg-black/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {location}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-shadow-lg transform transition-transform duration-300 group-hover:translate-x-2">
                  {title}
                </h1>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="p-6 text-center group hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-1 group-hover:text-gray-700">
                    <CalendarDays className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Submitted</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
                    {timeSince(submittalSeconds)}
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-700">ago on {submittalDate}</div>
                </div>

                <div className="p-6 text-center group hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-1 group-hover:text-gray-700">
                    <Building2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Status</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
                    {status}
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-700">Current project status</div>
                </div>

                <div className="p-6 text-center group hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-1 group-hover:text-gray-700">
                    <Clock className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Latest Update</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
                    {threads[0] ? timeSince(threads[0].timestamp) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-700">ago</div>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-100 p-3 sm:p-4 flex flex-wrap items-center justify-end gap-2 sm:gap-4 bg-gray-50">
              <span className="text-sm text-gray-500">Share</span>
              <div className="flex gap-2 sm:gap-3 items-center">
                <FacebookShareButton url={shareUrl}>
                  <div className="transform transition-transform hover:scale-110">
                    <FacebookIcon size={32} round />
                  </div>
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl}>
                  <XIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton url={shareUrl}>
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Now sticky with proper offset and mobile-friendly */}
          <div className="sticky top-[56px] sm:top-[72px] z-40 -mx-2 sm:-mx-4 px-2 sm:px-4 bg-[#F3F2EE]">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="flex flex-col sm:flex-row sm:divide-x divide-gray-100">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'text-emerald-600 bg-gradient-to-b from-emerald-50/80 to-emerald-100/80 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/80'
                  } ${
                    activeTab !== 'overview' && 'sm:hover:bg-gray-50/50'
                  } first:rounded-t-xl sm:first:rounded-l-xl sm:first:rounded-tr-none last:rounded-b-xl sm:last:rounded-r-xl sm:last:rounded-bl-none`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className={`w-4 h-4 ${
                      activeTab === 'overview' ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'timeline'
                      ? 'text-emerald-600 bg-gradient-to-b from-emerald-50/80 to-emerald-100/80 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/80'
                  } ${
                    activeTab !== 'timeline' && 'sm:hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className={`w-4 h-4 ${
                      activeTab === 'timeline' ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    Timeline
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'contact'
                      ? 'text-emerald-600 bg-gradient-to-b from-emerald-50/80 to-emerald-100/80 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/80'
                  } ${
                    activeTab !== 'contact' && 'sm:hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users className={`w-4 h-4 ${
                      activeTab === 'contact' ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    Contact & Docs
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content - Adjusted spacing for mobile */}
          <div className="mt-4 sm:mt-6 transition-all duration-300">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'timeline' && renderTimeline()}
            {activeTab === 'contact' && renderContactTab()}
          </div>
        </main>
      </div>
    </div>
  )
}
