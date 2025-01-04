'use client'

import GlobalHeader from '@/header'
import { 
  MapPin, Building2, FileText, Phone, Mail, Clock,
  CalendarDays, SquareStack, Users, ChevronRight, ExternalLink,
  Building, Scale, Car, Globe2, ImageIcon, MessageSquare,
  Newspaper, Calendar, ArrowUpRight
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useProjectProfileStore, useThreadStore, useGlobalThreadListStore } from '@/stores'
import { fetchDevelopments, timeSince } from '@/utils'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Thread from '../../../app/threads'
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


const CardHeader = ({ icon: Icon, title, color = 'emerald' }) => (
  <div className="mb-4 py-2 sm:py-4 pl-0">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className={`p-2 sm:p-2.5 bg-gradient-to-br from-${color}-50 to-${color}-100/50 rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${color}-600`} />
      </div>
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
    </div>
  </div>
)

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-none sm:rounded-xl border border-gray-200/80 py-3 sm:py-4 px-2 sm:p-8 ${className}`}
  >
    {children}
  </div>
)

const InfoBlock = ({ icon: Icon, label, value, subtext }) => (
  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50/80 to-white border border-gray-200/50">
    <div className="p-2 sm:p-2.5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div className="space-y-1">
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
    'Pubic Hearing': 2, // this is intended typo, keep it, don't fix it
    'Public Hearing': 2,
    'Final Action': 3,
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

  // Get color for each status
  const getStatusColor = (index) => {
    const colors = {
      active: {
        text: 'text-emerald-700'
      },
      completed: {
        text: 'text-emerald-600'
      },
      upcoming: {
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
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 rounded-full"></div>
        
        {/* Progress Line */}
        <div 
          className="absolute top-0 left-0 h-2 hidden sm:block bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
        
        {/* Simple mobile progress line */}
        <div 
          className="absolute top-0 left-0 h-2 sm:hidden bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />

        {/* Status Labels */}
        <div className="flex flex-col sm:flex-row justify-between relative pt-6">
          {statuses.map((s, i) => {
            const colors = getStatusColor(i)
            const isActive = i === statusOrder[status]
            
            return (
              <div 
                key={s}
                className={`flex items-center gap-2 mb-3 sm:mb-0 sm:flex-col sm:items-center transition-all duration-300 ${isActive ? 'scale-105' : ''}`}
              >
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 ring-4 ring-emerald-100' : i < statusOrder[status] ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                <span className={`text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300 ${colors.text}`}>
                  {s}
                </span>
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

const NavItem = ({ label, active, onClick, icon: Icon, count, isNew }) => (
  <button
    onClick={onClick}
    className={`
      relative px-4 py-2.5 text-sm font-medium transition-all duration-300 
      ${active 
        ? 'text-emerald-700' 
        : 'text-gray-500 hover:text-gray-800'
      }
      group flex items-center gap-2
    `}
  >
    <div className={`
      absolute inset-x-0 bottom-0 h-0.5 transition-all duration-300
      ${active 
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 w-full' 
        : 'w-0 group-hover:w-full bg-gray-200'
      }
    `}/>
    <span className="relative flex items-center gap-1.5">
      {label}
      {isNew && (
        <span className="relative inline-flex">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
          <span className="relative inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full leading-none">
            NEW
            <span className="inline-flex w-1 h-1 rounded-full bg-white/90 animate-pulse"></span>
          </span>
        </span>
      )}
      {count !== undefined && (
        <span className={`
          px-1.5 py-0.5 text-xs rounded-full 
          ${active 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          {count}
        </span>
      )}
    </span>
  </button>
)

const NewsCard = ({ article }) => {
  const [imageError, setImageError] = useState(false)
  
  // Simplified image validation - accept all images but handle errors gracefully
  const hasValidImage = article.urlToImage && !imageError

  // Format the date nicely
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {hasValidImage
          ? (
          <div className="relative w-full h-full">
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          </div>
            )
          : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Newspaper className="w-8 h-8 text-gray-400" />
          </div>
            )}
        {/* Source Label */}
        <div className="absolute top-2 right-2 z-10">
          <div className="px-2 py-1 text-[10px] font-medium bg-white/90 backdrop-blur-sm rounded-full text-gray-600 shadow-sm">
            {article.source?.name || 'News Source'}
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Date and Source Label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-md">
            {article.source?.name}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
          {article.description || 'No description available'}
        </p>
        <div className="flex items-center justify-end text-xs">
          <div className="flex items-center gap-1 text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
            Read more
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </a>
  )
}

const NewsLoadingSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="h-16 bg-gray-100 rounded" />
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="h-3 bg-gray-100 rounded w-20" />
      </div>
    </div>
  </div>
)

// Add debounce function at the top level
const debounce = (func, wait) => {
  let timeout
  return function executedFunction (...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default function Project ({ params }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  
  // Add scroll to top effect when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const overviewRef = useRef(null)
  const locationRef = useRef(null)
  const imagesRef = useRef(null)
  const plannerRef = useRef(null)
  const applicantRef = useRef(null)
  const documentsRef = useRef(null)
  const discussionsRef = useRef(null)
  const timelineRef = useRef(null)
  const newsRef = useRef(null)
  const specificationsRef = useRef(null)
  const [newsArticles, setNewsArticles] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for sticky header

      const refs = [
        { id: 'overview', ref: overviewRef },
        { id: 'location', ref: locationRef },
        { id: 'images', ref: imagesRef },
        { id: 'news', ref: newsRef },
        { id: 'specifications', ref: specificationsRef },
        { id: 'planner', ref: plannerRef },
        { id: 'applicant', ref: applicantRef },
        { id: 'documents', ref: documentsRef },
        { id: 'discussions', ref: discussionsRef },
        { id: 'timeline', ref: timelineRef }
      ]

      for (let i = refs.length - 1; i >= 0; i--) {
        const { id, ref } = refs[i]
        if (ref.current && ref.current.offsetTop <= scrollPosition) {
          setActiveSection(id)
          // Update URL with section parameter
          const url = new URL(window.location.href)
          url.searchParams.set('section', id)
          window.history.replaceState({}, '', url)
          break
        }
      }
    }

    // Create debounced version of scroll handler
    const debouncedHandleScroll = debounce(handleScroll, 100)

    window.addEventListener('scroll', debouncedHandleScroll)
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
      // Cleanup any pending debounced calls
      debouncedHandleScroll.cancel?.()
    }
  }, [])

  const scrollToSection = (sectionRef, sectionId) => {
    if (sectionRef.current) {
      const yOffset = -80 // Offset for sticky header
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveSection(sectionId)
      // Update URL with session parameter
      const url = new URL(window.location.href)
      url.searchParams.set('section', sectionId)
      window.history.replaceState({}, '', url)
    }
  }

  // Handle initial section from URL on mount
  useEffect(() => {
    const url = new URL(window.location.href)
    const section = url.searchParams.get('section')
    if (section) {
      const sectionRefs = {
        overview: overviewRef,
        location: locationRef,
        images: imagesRef,
        news: newsRef,
        specifications: specificationsRef,
        planner: plannerRef,
        applicant: applicantRef,
        documents: documentsRef,
        discussions: discussionsRef,
        timeline: timelineRef
      }
      if (sectionRefs[section]) {
        setTimeout(() => {
          scrollToSection(sectionRefs[section], section)
        }, 500) // Small delay to ensure content is loaded
      }
    }
  }, [])

  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        useThreadStore.getState().update(data)
        // Filter threads for this project and update global thread list
        const projectThreads = data.filter(item => item.projectId === params.projectId)
        useGlobalThreadListStore.getState().init(projectThreads)
        setLoading(false)
      })
  }, [params.projectId])

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

  useEffect(() => {
    if (project) {
      const fetchNews = async () => {
        try {
          setLoadingNews(true)
          // Just use the project title for the base query, the API will add local context
          const searchQuery = `"${project.title}"`
          console.log('🔍 Fetching news with query:', searchQuery)
          
          const response = await fetch(
            `/api/news?q=${encodeURIComponent(searchQuery)}&pageSize=10`
          )
          const data = await response.json()
          
          console.log('📰 News API Response:', {
            status: response.status,
            ok: response.ok,
            data
          })
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch news')
          }
          
          setNewsArticles(data.articles || [])
        } catch (error) {
          console.error('❌ Error fetching news:', error)
          setNewsArticles([])
        } finally {
          setLoadingNews(false)
        }
      }
      fetchNews()
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

  const renderTimeline = () => {
    return (
      <div className="space-y-8 animate-fadeIn bg-[#F3F2EE]">
        <Card className="bg-white">
          <CardHeader icon={Clock} title="Project Timeline" />
          <div>
            <Thread thread={threads} unit="updates" global={false} />
          </div>
        </Card>
      </div>
    )
  }

  const renderHeroSection = () => (
    <div className="min-h-screen bg-[#F3F2EE] selection:bg-emerald-500/10 selection:text-emerald-900 relative">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="fixed -top-24 -right-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <GlobalHeader />
      <div className="container mx-auto sm:px-4 px-0 sm:py-6 sm:py-8 md:py-12">
        <main className="max-w-[1400px] mx-auto space-y-8">
          {/* Hero Section */}
          <div className="bg-white sm:rounded-xl rounded-none shadow-sm overflow-hidden">
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
                  <div className="text-sm text-gray-500">
                    ago on {submittalDate}
                  </div>
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

          {/* Navigation */}
          <div className="sticky sm:top-[4rem] top-[3.5rem] z-30 sm:-mt-4">
            <div className="bg-white shadow-sm border-gray-200/80 shadow-sm">
              <div className="container mx-auto">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-1 mx-auto max-w-[1400px] px-4">
                    <div className="flex items-center">
                      <NavItem
                        label="Overview"
                        active={activeSection === 'overview'}
                        onClick={() => scrollToSection(overviewRef, 'overview')}
                      />
                      <NavItem
                        label="Location"
                        active={activeSection === 'location'}
                        onClick={() => scrollToSection(locationRef, 'location')}
                      />
                      {images.length > 0 && (
                        <NavItem
                          label="Images"
                          active={activeSection === 'images'}
                          onClick={() => scrollToSection(imagesRef, 'images')}
                          count={images.length}
                        />
                      )}
                      <NavItem
                        label="News"
                        active={activeSection === 'news'}
                        onClick={() => scrollToSection(newsRef, 'news')}
                        count={newsArticles.length}
                        isNew={true}
                      />
                      <NavItem
                        label="Discussions"
                        active={activeSection === 'discussions'}
                        onClick={() =>
                          scrollToSection(discussionsRef, 'discussions')
                        }
                      />
                      <NavItem
                        label="Specifications"
                        active={activeSection === 'specifications'}
                        onClick={() =>
                          scrollToSection(specificationsRef, 'specifications')
                        }
                      />
                      <NavItem
                        label="Planner"
                        active={activeSection === 'planner'}
                        onClick={() => scrollToSection(plannerRef, 'planner')}
                      />
                      <NavItem
                        label="Applicant"
                        active={activeSection === 'applicant'}
                        onClick={() =>
                          scrollToSection(applicantRef, 'applicant')
                        }
                      />
                      {docs.length > 0 && (
                        <NavItem
                          label="Documents"
                          active={activeSection === 'documents'}
                          onClick={() =>
                            scrollToSection(documentsRef, 'documents')
                          }
                          count={docs.length}
                        />
                      )}
                      <NavItem
                        label="Timeline"
                        active={activeSection === 'timeline'}
                        onClick={() => scrollToSection(timelineRef, 'timeline')}
                        count={threads.length}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/5" />
          </div>

          {/* Content */}
          <div className="transition-all duration-300 space-y-4 sm:space-y-8">
            <div ref={overviewRef}>{renderOverviewTab()}</div>
            <div ref={locationRef}>
              {/* Location Card */}
              <Card>
                <CardHeader icon={MapPin} title="Location" />
                <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
                  <div className="flex-1 space-y-4 sm:space-y-6">
                    <div>
                      <p className="text-gray-600 mb-4">{location}</p>
                      {geolocation?.lat && geolocation?.lon
                        ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 pb-2">
                            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                              <p className="text-sm text-gray-500 group-hover:text-gray-600">
                                Latitude
                              </p>
                              <p className="font-medium text-gray-900 group-hover:text-emerald-600">
                                {geolocation.lat.toFixed(6)}°
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                              <p className="text-sm text-gray-500 group-hover:text-gray-600">
                                Longitude
                              </p>
                              <p className="font-medium text-gray-900 group-hover:text-emerald-600">
                                {geolocation.lon.toFixed(6)}°
                              </p>
                            </div>
                          </div>
                          <LinkButton
                            href={`https://www.google.com/maps/place/${geolocation.lat},${geolocation.lon}`}
                            icon={ExternalLink}
                            color="emerald"
                          >
                            View on Google Maps
                          </LinkButton>
                        </>
                          )
                        : (
                        <LinkButton
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${location} Dublin, CA`
                          )}`}
                          icon={ExternalLink}
                          color="emerald"
                        >
                          View on Google Maps
                        </LinkButton>
                          )}
                    </div>
                  </div>
                  <div className="flex-1">
                    {geolocation?.lat && geolocation?.lon
                      ? (
                      <div className="h-[300px] rounded-lg overflow-hidden shadow-md">
                        <Map
                          mapboxAccessToken={
                            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
                          }
                          initialViewState={{
                            longitude: geolocation.lon,
                            latitude: geolocation.lat,
                            zoom: 14
                          }}
                          style={{ height: '100%' }}
                          mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
                        >
                          <Marker
                            longitude={geolocation.lon}
                            latitude={geolocation.lat}
                          >
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
                        )
                      : (
                      <div className="h-[300px] rounded-lg overflow-hidden shadow-md bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">
                            Map view not available
                          </p>
                          <p className="text-sm text-gray-400">
                            Coordinates not provided for this location
                          </p>
                        </div>
                      </div>
                        )}
                  </div>
                </div>
              </Card>
            </div>
            {images.length > 0 && (
              <div ref={imagesRef}>
                {/* Project Images Card */}
                <Card>
                  <CardHeader icon={ImageIcon} title="Project Images" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {images.map((image, index) => (
                      <div key={index} className="group relative">
                        <div className="aspect-[4/3] sm:aspect-video relative rounded-lg overflow-hidden shadow-md">
                          <Image
                            src={image.original}
                            alt={`Project image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="text-white text-sm font-medium">
                                View {index + 1} of {images.length}
                              </p>
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
              </div>
            )}
            <div ref={newsRef}>
              <Card>
                <CardHeader
                  icon={Newspaper}
                  title="Related Online Articles"
                  color="blue"
                />
                <div className="pb-4 sm:pb-8">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-gray-600">
                      Stay informed about news and updates related to this
                      development project and the surrounding area.
                    </p>
                  </div>
                  {loadingNews
                    ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {[...Array(6)].map((_, i) => (
                        <NewsLoadingSkeleton key={i} />
                      ))}
                    </div>
                      )
                    : newsArticles.length > 0
                      ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {newsArticles.map((article, index) => (
                        <NewsCard
                          key={`${article.url}-${index}`}
                          article={article}
                        />
                      ))}
                    </div>
                        )
                      : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200/80">
                      <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">
                        No related news articles found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        We couldn't find any recent news articles related to
                        this project.
                      </p>
                    </div>
                        )}
                </div>
              </Card>
            </div>

            <div ref={discussionsRef}>
              <Card>
                <CardHeader
                  icon={MessageSquare}
                  title="Community Discussions"
                />
                <div className="pb-4 sm:pb-8">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-gray-600">
                      Join the conversation about this development project.
                      Share your thoughts, ask questions, and connect with other
                      community members.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-none sm:rounded-xl p-4 sm:p-6 border border-gray-200/80">
                    <DisqusComments
                      id={id}
                      title={title}
                      url={`https://dublin.amazyyy.com/project/${id}`}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Project Specifications */}
            <div ref={specificationsRef}>
              <Card>
                <CardHeader
                  icon={Building2}
                  title="Project Specifications"
                  color="purple"
                />
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Application Details
                      </h3>
                      <div className="space-y-3">
                        <InfoBlock
                          icon={FileText}
                          label="Application Number"
                          value="PLPA-2024-00047 and PLPA-004036-2024"
                          subtext="Submitted on 05/17/2024"
                        />
                        <InfoBlock
                          icon={Globe2}
                          label="Land Use"
                          value="DDSP Retail District"
                          subtext="Zoning classification for development"
                        />
                        <InfoBlock
                          icon={Building2}
                          label="Specific Plan Area"
                          value="Downtown Dublin Retail District"
                          subtext="Development plan zone"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Project Metrics
                      </h3>
                      <div className="space-y-3">
                        <InfoBlock
                          icon={Building}
                          label="Project Area"
                          value="Approx. 28 acres"
                          subtext="Total development area"
                        />
                        <InfoBlock
                          icon={Scale}
                          label="Floor Area Ratio"
                          value="N/A"
                          subtext="Ratio of total floor area to lot size"
                        />
                        <InfoBlock
                          icon={Car}
                          label="Parking Spaces"
                          value="N/A"
                          subtext="Number of parking spaces"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <InfoBlock
                      icon={SquareStack}
                      label="Application Type"
                      value="Vesting Tentative Tract Map and Development and Community Benefit Program Agreement / Site Development Review Permit and Heritage Tree Removal Permit"
                      subtext="Type of development application"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div ref={plannerRef}>{renderContactTab()}</div>
            <div ref={timelineRef}>{renderTimeline()}</div>
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
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </Card>
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
      <div ref={applicantRef}>
        <Card>
          <CardHeader icon={Building2} title="Applicant" color="emerald" />
          <div className="space-y-6">
            <div className="text-2xl font-bold text-gray-900">{details.Applicant.name}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href={`tel:${details.Applicant.phone}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-200/50 transition-all duration-300 transform active:scale-[0.98]"
              >
                <div className="p-2.5 bg-gradient-to-br from-white to-emerald-50/30 rounded-none sm:rounded-xl shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]">
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
      </div>

      {/* Documents */}
      {docs.length > 0 && (
        <div ref={documentsRef}>
          <Card>
            <CardHeader icon={FileText} title="Documents" color="orange" />
            <div className="pb-8">
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
        </div>
      )}
    </div>
  )

  return renderHeroSection()
}
