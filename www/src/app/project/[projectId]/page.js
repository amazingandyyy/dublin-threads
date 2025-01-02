'use client'

import GlobalHeader from '@/header'
import { 
  MapPin, Building2, FileText, Phone, Mail, Clock,
  CalendarDays, SquareStack, Users, ChevronRight, ExternalLink,
  Building, Scale, Car, Globe2, ImageIcon, MessageSquare
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
        return 'bg-emerald-50 text-emerald-700'
      case 'status':
        return 'bg-blue-50 text-blue-700'
      case 'detail':
        return 'bg-purple-50 text-purple-700'
      case 'description':
        return 'bg-orange-50 text-orange-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getIconBackground = () => {
    switch (event.type) {
      case 'submit':
        return 'bg-emerald-50'
      case 'status':
        return 'bg-blue-50'
      case 'detail':
        return 'bg-purple-50'
      case 'description':
        return 'bg-orange-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className="relative pl-12 mb-8 last:mb-0 animate-in fade-in slide-in-from-left-1 duration-500">
      <div className={`absolute left-0 w-8 h-8 rounded-xl ${getIconBackground()} p-2 ring-1 ring-gray-200 shadow-sm`}>
        {getIcon()}
      </div>
      
      <div className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl p-6 sm:p-8 border border-gray-200/80">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <time className="text-sm text-gray-500 tabular-nums">
            {new Date(event.timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </time>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEventColor()}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{event.title}</h3>
        
        {event.type === 'description' && (
          <div className="mt-6 space-y-4 bg-gray-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</span>
                </div>
                <div className="text-sm text-gray-600">{event.oldValue || 'Not set'}</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">New</span>
                </div>
                <div className="text-sm font-medium text-emerald-600">{event.newValue}</div>
              </div>
            </div>
          </div>
        )}
        
        {event.type === 'detail' && (
          <div className="mt-6 space-y-6">
            {event.changes.map((change, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-medium text-gray-700 mb-4">{change.field}</div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-24">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</span>
                    </div>
                    <div className="text-sm text-gray-600">{change.oldValue || 'Not set'}</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-24">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">New</span>
                    </div>
                    <div className="text-sm font-medium text-emerald-600">{change.newValue}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {event.type === 'status' && (
          <div className="mt-6 bg-gray-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</span>
                </div>
                <div className="text-sm text-gray-600">{event.oldValue || 'Not set'}</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">New</span>
                </div>
                <div className="text-sm font-medium text-emerald-600">{event.newValue}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const InfoTooltip = ({ text }) => (
  <div className="group relative inline-block ml-1">
    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 text-xs cursor-help shadow-sm">?</div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900/95"></div>
    </div>
  </div>
)

const MetricCard = ({ icon: Icon, label, value, tooltip }) => {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="flex items-center">
          <h3 className="font-medium text-gray-700">{label}</h3>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      </div>
      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 animate-in fade-in slide-in-from-bottom-1 duration-500">{value}</p>
    </Card>
  )
}

const CardHeader = ({ icon: Icon, title, color = 'emerald' }) => (
  <div className="-mx-8 -mt-8 mb-8 p-8 border-b border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 bg-gradient-to-br from-${color}-50 to-${color}-100/50 rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
  </div>
)

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-gradient-to-br from-white to-gray-50/80 rounded-2xl border border-gray-200/80 ${
    noPadding ? '' : 'p-8'
  } ${className}`}>
    {children}
  </div>
)

const InfoBlock = ({ icon: Icon, label, value, subtext }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50/80 to-white border border-gray-200/50">
    <div className="p-2.5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900 animate-in fade-in slide-in-from-left-1 duration-500">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  </div>
)

const LinkButton = ({ href, icon: Icon, children, color = 'blue' }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-${color}-200 text-${color}-600 bg-white rounded-lg hover:border-${color}-500 hover:bg-${color}-50 transition-all duration-200 group`}
  >
    <Icon className={`w-4 h-4 text-${color}-500 group-hover:text-${color}-600`} />
    <span className={`group-hover:text-${color}-700`}>{children}</span>
    <ChevronRight className={`w-4 h-4 text-${color}-500 group-hover:text-${color}-600 transition-transform group-hover:translate-x-1`} />
  </a>
)

const StatusProgress = ({ status }) => {
  const statuses = ['Submitted', 'Under Review', 'Pubic Hearing', 'Approved', 'In Progress', 'Completed']
  
  const statusOrder = {
    Submitted: 0,
    'Under Review': 1,
    'Pubic Hearing': 2,
    'Public Hearing': 2,
    Approved: 3,
    'In Progress': 4,
    Completed: 5
  }

  // Calculate progress based on current status
  const getProgress = () => {
    const currentStep = statusOrder[status] || 0
    return ((currentStep + 1) / 6) * 100
  }

  const progress = getProgress()

  // Helper to determine if a status is completed
  const isCompleted = (index) => {
    return index <= statusOrder[status]
  }

  // Get color for each status
  const getStatusColor = (index) => {
    const colors = {
      active: {
        bg: 'bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500',
        text: 'text-emerald-700'
      },
      completed: {
        bg: 'bg-emerald-500',
        text: 'text-emerald-600'
      },
      upcoming: {
        bg: 'bg-gray-200',
        text: 'text-gray-400'
      }
    }

    const currentStatusIndex = statusOrder[status]
    if (index === currentStatusIndex) return colors.active
    if (index < currentStatusIndex) return colors.completed
    return colors.upcoming
  }

  return (
    <div className="mt-2">
      {/* Status Points and Line */}
      <div className="relative">
        {/* Base Line */}
        <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-100"></div>
        
        {/* Progress Line */}
        <div 
          className="absolute top-2 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />

        {/* Status Points */}
        <div className="flex justify-between relative">
          {statuses.map((s, i) => {
            const colors = getStatusColor(i)
            const isCurrentStatus = statusOrder[status] === i
            
            return (
              <div 
                key={s}
                className="flex flex-col items-center"
              >
                {/* Status Dot */}
                <div 
                  className={`w-4 h-4 rounded-full ${colors.bg} ring-[3px] ring-white shadow-sm transition-all duration-300 ${
                    isCurrentStatus ? 'scale-110' : ''
                  }`}
                >
                  {isCompleted(i) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                  )}
                </div>
                
                {/* Status Label */}
                <div className="mt-3 text-center">
                  <span className={`text-[11px] font-medium whitespace-nowrap transition-colors duration-300 ${colors.text}`}>
                    {s}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const DisqusComments = ({ id, title, url }) => {
  useEffect(() => {
    // Load Disqus script
    const script = document.createElement('script')
    script.src = 'https://dublin-threads.disqus.com/embed.js'
    script.setAttribute('data-timestamp', +new Date())
    document.body.appendChild(script)

    // Configure Disqus
    window.disqus_config = function () {
      this.page.url = url
      this.page.identifier = id
      this.page.title = title
    }

    return () => {
      // Cleanup
      const disqusThread = document.getElementById('disqus_thread')
      if (disqusThread) {
        while (disqusThread.hasChildNodes()) {
          disqusThread.removeChild(disqusThread.firstChild)
        }
      }
      // Remove the script
      script.remove()
    }
  }, [id, title, url])

  return <div id="disqus_thread" className="min-h-[300px] px-4" />
}

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
      <div className="space-y-8 animate-fadeIn">
        <Card>
          <CardHeader icon={Clock} title="Project Timeline" />
          <div className="p-8">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
              {events.map((event, index) => (
                <TimelineEvent key={index} event={event} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const renderHeroSection = () => (
    <div className="min-h-screen bg-[#F3F2EE] selection:bg-emerald-500/10 selection:text-emerald-900">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <main className="max-w-[1400px] mx-auto space-y-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden">
              {images[0] && (
                <Image
                  src={images[0].original}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80 z-10" />
              <div className="absolute bottom-0 left-0 p-8 z-20 text-white w-full">
                <div className="flex flex-wrap items-center gap-3 text-sm mb-4 opacity-95">
                  <span className="bg-emerald-500 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    {status}
                  </span>
                  <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-shadow-xl">
                  {title}
                </h1>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>Submitted</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {timeSince(submittalSeconds)}
                  </div>
                  <div className="text-sm text-gray-500">ago on {submittalDate}</div>
                </div>

                <div className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-1">
                    <Building2 className="w-4 h-4" />
                    <span>Status</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {status}
                  </div>
                </div>

                <div className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Latest Update</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {threads[0] ? timeSince(threads[0].timestamp) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">ago</div>
                </div>
              </div>
            </div>

            {/* Status Progress */}
            <div className="border-t border-gray-100 px-6 py-4">
              <StatusProgress status={status} />
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-100 p-3 sm:p-4 flex flex-wrap items-center justify-end gap-2 sm:gap-4 bg-gradient-to-br from-gray-50 to-gray-50/30">
              <span className="text-sm text-gray-500">Share</span>
              <div className="flex gap-2 sm:gap-3 items-center">
                <FacebookShareButton url={shareUrl}>
                  <div className="transform transition-transform hover:scale-110 hover:shadow-sm">
                    <FacebookIcon size={32} round />
                  </div>
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl}>
                  <div className="transform transition-transform hover:scale-110 hover:shadow-sm">
                    <XIcon size={32} round />
                  </div>
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl}>
                  <div className="transform transition-transform hover:scale-110 hover:shadow-sm">
                    <WhatsappIcon size={32} round />
                  </div>
                </WhatsappShareButton>
                <EmailShareButton url={shareUrl}>
                  <div className="transform transition-transform hover:scale-110 hover:shadow-sm">
                    <EmailIcon size={32} round />
                  </div>
                </EmailShareButton>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="sticky top-[72px] z-40 -mx-4 px-4 bg-[#F3F2EE]">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'text-gray-900 bg-gradient-to-br from-gray-50 to-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className={`w-4 h-4 transition-colors duration-300 ${
                      activeTab === 'overview' ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 px-6 py-4 text-sm font-medium ${
                    activeTab === 'timeline'
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className={`w-4 h-4 ${
                      activeTab === 'timeline' ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                    Timeline
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 px-6 py-4 text-sm font-medium ${
                    activeTab === 'contact'
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users className={`w-4 h-4 ${
                      activeTab === 'contact' ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                    Contact & Docs
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`flex-1 px-6 py-4 text-sm font-medium ${
                    activeTab === 'discussions'
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className={`w-4 h-4 ${
                      activeTab === 'discussions' ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                    Discussions
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="transition-all duration-300 space-y-8">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'timeline' && renderTimeline()}
            {activeTab === 'contact' && renderContactTab()}
            {activeTab === 'discussions' && (
              <div className="space-y-8 animate-fadeIn">
                <Card>
                  <CardHeader icon={MessageSquare} title="Community Discussions" />
                  <div className="px-8 pb-8">
                    <div className="mb-6">
                      <p className="text-gray-600">Join the conversation about this development project. Share your thoughts, ask questions, and connect with other community members.</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200/80">
                      <DisqusComments 
                        id={id}
                        title={title}
                        url={`https://dublin.amazyyy.com/project/${id}`}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )

  const renderOverviewTab = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Project Description */}
      <Card>
        <CardHeader icon={FileText} title="Project Overview" />
        <p className="text-gray-600 leading-relaxed mb-8">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Application Details
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
            <h3 className="text-lg font-semibold text-gray-900">
              Project Specifications
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
        />
        <MetricCard
          icon={Scale}
          label="Floor Area Ratio"
          value={details['Floor Area Ratio'] || 'N/A'}
          tooltip="Ratio of total floor area to lot size"
        />
        <MetricCard
          icon={Car}
          label="Parking Spaces"
          value={details['Parking Provided'] || 'N/A'}
          tooltip="Number of parking spaces provided"
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
    <div className="space-y-8 animate-fadeIn">
      {/* Project Planner */}
      <Card>
        <CardHeader icon={Users} title="Project Planner" color="blue" />
        <div className="space-y-6">
          <div className="text-2xl font-bold text-gray-900">{details['Project Planner'].name}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={`tel:${details['Project Planner'].phone}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-white border border-blue-200/50 transition-all duration-300 transform active:scale-[0.98]"
            >
              <div className="p-2.5 bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Phone</p>
                <p className="font-semibold text-gray-900">{details['Project Planner'].phone}</p>
              </div>
            </a>
            
            <a 
              href={`mailto:${details['Project Planner'].email}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200/50 hover:border-blue-500/50 hover:bg-blue-50/80 transition-colors"
            >
              <div className="p-2.5 bg-white rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Email</p>
                <p className="font-semibold text-gray-900">{details['Project Planner'].email}</p>
              </div>
            </a>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(details['Project Planner'].name)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 border border-blue-200/50 rounded-lg hover:border-blue-500/50 hover:bg-blue-50/80 transition-colors"
            >
              <div className="p-1.5 bg-white rounded-lg shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.38-.49-2.32-1.72-2.32a1.87,1.87,0,0,0-1.75,1.26,2.33,2.33,0,0,0-.11.82v5.07h-3s.05-8.17,0-9h3V11A3.37,3.37,0,0,1,15.46,9.5c2.23,0,3.45,1.46,3.45,4.59Z"/></svg>
              </div>
              Find on LinkedIn
            </a>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${details['Project Planner'].name} dublin ca`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 border border-blue-200/50 rounded-lg hover:border-blue-500/50 hover:bg-blue-50/80 transition-colors"
            >
              <div className="p-1.5 bg-white rounded-lg shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <svg className="w-4 h-4" viewBox="0 0 488 512">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="#4285f4"/>
                </svg>
              </div>
              Search on Google
            </a>
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
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-200/50 transition-all duration-300 transform active:scale-[0.98]"
            >
              <div className="p-2.5 bg-gradient-to-br from-white to-emerald-50/30 rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">Phone</p>
                <p className="font-semibold text-gray-900">{details.Applicant.phone}</p>
              </div>
            </a>
            
            <a 
              href={`https://www.google.com/maps/place/${details.Applicant.address.split(' ').join('+')}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/50 hover:border-emerald-500/50 hover:bg-emerald-50/80 transition-colors"
            >
              <div className="p-2.5 bg-white rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">Address</p>
                <p className="font-semibold text-gray-900">{details.Applicant.address}</p>
              </div>
            </a>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(details.Applicant.name)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50/50 border border-emerald-200/50 rounded-lg hover:border-emerald-500/50 hover:bg-emerald-50/80 transition-colors"
            >
              <div className="p-1.5 bg-white rounded-lg shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.38-.49-2.32-1.72-2.32a1.87,1.87,0,0,0-1.75,1.26,2.33,2.33,0,0,0-.11.82v5.07h-3s.05-8.17,0-9h3V11A3.37,3.37,0,0,1,15.46,9.5c2.23,0,3.45,1.46,3.45,4.59Z"/></svg>
              </div>
              Find on LinkedIn
            </a>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${details.Applicant.name} dublin ca`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50/50 border border-emerald-200/50 rounded-lg hover:border-emerald-500/50 hover:bg-emerald-50/80 transition-colors"
            >
              <div className="p-1.5 bg-white rounded-lg shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                <svg className="w-4 h-4" viewBox="0 0 488 512">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="#4285f4"/>
                </svg>
              </div>
              Search on Google
            </a>
          </div>
        </div>
      </Card>

      {/* Documents */}
      {docs.length > 0 && (
        <Card>
          <CardHeader icon={FileText} title="Documents" color="orange" />
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 gap-3">
              {docs.map((doc) => (
                <a
                  key={doc.url}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-orange-50/50 border border-orange-200/50 hover:border-orange-500/50 hover:bg-orange-50/80 transition-colors"
                >
                  <div className="p-2.5 bg-white rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-gray-900">{doc.name || 'Document'}</p>
                    <p className="text-sm text-orange-600">Click to view</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
                    <ExternalLink className="w-4 h-4 text-orange-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )

  return renderHeroSection()
}
