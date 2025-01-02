'use client'
import { Fragment, useEffect, useState, useRef, useMemo } from 'react'
import { useGlobalThreadListStore } from '@/stores'
import _ from 'lodash'
import {
  CameraIcon,
  DocumentIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

// Utility function to validate post content
const isValidPost = (post) => {
  if (!post) return false

  if (post.op === 'add' && post.path?.[1] === 'docs') {
    return !!post.val?.url && !!post.val?.name // Validate document has required fields
  }

  if (post.op === 'update') {
    const updateType = post.path?.[1]
    const fieldName = post.path?.[2]

    // Validate that we have both old and new values for updates
    if (!post.val) return false

    // Special case for Planning Application updates
    if (updateType === 'details' && fieldName === 'Planning Application #') {
      return true
    }

    // Validate regular updates
    switch (updateType) {
      case 'status':
      case 'description':
      case 'details':
      case 'images':
        return true
      default:
        return false
    }
  }

  return false
}

function PostPlaceholder () {
  const emptyArray = (length = 5) => (Array.from(Array(length).keys()))

  return <div>
    {emptyArray(20).map(i => (<div key={i} className='flex m-2 animate-pulse opacity-20'>
    <div className='flex flex-col self-stretch w-full p-6 bg-gray-50 md:rounded-2xl'>
      <div className='flex item-between'>
        <div className='self-stretch mb-4 bg-gray-200 rounded-md w-64 h-8' />
        <div className='flex-grow self-stretch mb-2 rounded-full w-96 h-[15px]' />
        <div className='self-stretch mb-2 bg-gray-200 rounded-full w-16 h-[15px]' />
      </div>
      <div className='self-stretch mb-2 bg-gray-200 rounded-full w-96 h-[15px]' />
      <div className='self-stretch mb-2 bg-gray-200 rounded-full w-64 h-[15px]' />
      <div className='self-stretch mb-2 bg-gray-200 rounded-full w-48 h-[15px]' />
    </div>
  </div>))}
  </div>
}

function Post ({ data }) {
  const CardWrapper = ({ children }) => (
    <div className='bg-white rounded-xl border border-gray-100'>
      <div className='px-6 py-5'>
        {children}
      </div>
    </div>
  )

  const renderMetadata = () => {
    const timestamp = new Date(Number(data.timestamp))
    const timeString = timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    const getUpdateIcon = () => {
      if (data.op === 'add' && data.path?.[1] === 'docs') {
        return <div className='w-10 h-10 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-100/50 shadow-sm'>
          <DocumentIcon className='w-5 h-5 text-amber-600' />
        </div>
      }
      if (data.op === 'update') {
        const updateType = data.path?.[1]
        switch (updateType) {
          case 'status':
            return <div className='w-10 h-10 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-rose-100/50 shadow-sm'>
              <ArrowPathIcon className='w-5 h-5 text-rose-600' />
            </div>
          case 'description':
            return <div className='w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200/50 shadow-sm'>
              <PencilSquareIcon className='w-5 h-5 text-gray-600' />
            </div>
          case 'details':
            return <div className='w-10 h-10 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-100/50 shadow-sm'>
              <InformationCircleIcon className='w-5 h-5 text-emerald-600' />
            </div>
          case 'images':
            return <div className='w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100/50 shadow-sm'>
              <CameraIcon className='w-5 h-5 text-blue-600' />
            </div>
          default:
            return <div className='w-10 h-10 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-100/50 shadow-sm'>
              <PencilSquareIcon className='w-5 h-5 text-emerald-600' />
            </div>
        }
      }
    }

    return (
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-4'>
          {getUpdateIcon()}
          <div className='flex flex-col'>
            <div className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
              <a
                href={`/project/${data.projectId}`}
                className='hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group/link'
              >
                Dublin Commons
                {data.projectId && (
                  <span className='text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100/50 group-hover/link:bg-blue-50 group-hover/link:text-blue-600 group-hover/link:border-blue-100/50 transition-all duration-200'>
                    #{data.projectId}
                  </span>
                )}
                <ArrowTopRightOnSquareIcon className='w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity' />
              </a>
            </div>
            <div className='text-xs text-gray-500 mt-1 flex items-center gap-2'>
              <span>{timeString}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDocumentAdd = () => {
    const docInfo = data.val
    return (
      <div className='flex flex-col'>
        <div className='text-sm text-gray-600 mb-3'>
          Added a new document to the project
        </div>
        <div className='bg-gradient-to-br from-amber-50/50 to-transparent border border-amber-100/50 rounded-lg overflow-hidden hover:border-amber-200/50 transition-all duration-200 shadow-sm'>
          <a
            href={docInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className='flex items-start gap-3 p-4 group'
          >
            <div className='bg-amber-100/75 p-2.5 rounded-lg flex-shrink-0 shadow-sm'>
              <DocumentIcon className='w-5 h-5 text-amber-600' />
            </div>
            <div className='flex-grow min-w-0'>
              <div className='text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors duration-200 line-clamp-2'>
                {docInfo.name}
              </div>
              <div className='text-xs text-gray-500 mt-1.5 flex items-center gap-1.5'>
                <ArrowTopRightOnSquareIcon className='w-3.5 h-3.5' />
                View document
              </div>
            </div>
          </a>
        </div>
      </div>
    )
  }

  const renderStatusUpdate = () => {
    return (
      <div className='flex flex-col'>
        <div className='text-sm text-gray-600 mb-3'>
          Updated the project status
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex-1 px-4 py-3 bg-gradient-to-br from-gray-50 to-transparent border border-gray-100/50 rounded-lg shadow-sm'>
            <div className='text-xs text-gray-500 mb-1.5'>Previous status</div>
            <div className='text-sm text-gray-600'>{data.oldVal}</div>
          </div>
          <div className='w-8 h-8 bg-rose-100/75 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-rose-100/50'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-rose-600">
              <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </div>
          <div className='flex-1 px-4 py-3 bg-gradient-to-br from-rose-50 to-transparent border border-rose-100/50 rounded-lg shadow-sm'>
            <div className='text-xs text-rose-500 mb-1.5'>New status</div>
            <div className='text-sm text-rose-600 font-medium'>{data.val}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderDescriptionUpdate = () => {
    return (
      <div className='flex flex-col'>
        <div className='text-sm text-gray-600 mb-3'>
          Updated the project description
        </div>
        <div className='space-y-3'>
          <div className='px-3 py-2.5 bg-gradient-to-br from-gray-50 to-transparent border border-gray-100 rounded-lg'>
            <div className='text-xs text-gray-500 mb-1'>Previous description</div>
            <div className='text-sm text-gray-600'>{data.oldVal}</div>
          </div>
          <div className='px-3 py-2.5 bg-gradient-to-br from-emerald-50 to-transparent border border-emerald-100 rounded-lg'>
            <div className='text-xs text-emerald-500 mb-1'>New description</div>
            <div className='text-sm text-gray-900'>{data.val}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderDetailUpdate = () => {
    const fieldName = data.path[2]
    return (
      <div className='flex flex-col'>
        <div className='text-sm text-gray-600 mb-3'>
          Updated {fieldName.toLowerCase()}
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex-1 px-3 py-2.5 bg-gradient-to-br from-gray-50 to-transparent border border-gray-100 rounded-lg'>
            <div className='text-xs text-gray-500 mb-1'>Previous value</div>
            <div className='text-sm text-gray-600'>{data.oldVal || 'Not set'}</div>
          </div>
          <div className='w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-600">
              <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </div>
          <div className='flex-1 px-3 py-2.5 bg-gradient-to-br from-emerald-50 to-transparent border border-emerald-100 rounded-lg'>
            <div className='text-xs text-emerald-500 mb-1'>New value</div>
            <div className='text-sm text-emerald-600 font-medium'>{data.val}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderImageUpdate = () => {
    return (
      <div className='flex flex-col'>
        <div className='text-sm text-gray-600 mb-3'>
          Added a new project photo
        </div>
        <div className='relative aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden group border border-gray-100 group-hover:border-gray-200'>
          <img
            src={data.val}
            alt="Project photo"
            className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    // Handle document additions
    if (data.op === 'add' && data.path?.[1] === 'docs') {
      return renderDocumentAdd()
    }

    // Handle all types of updates
    if (data.op === 'update') {
      const updateType = data.path?.[1]
      const fieldName = data.path?.[2]

      // Handle special cases first
      if (updateType === 'details' && fieldName === 'Planning Application #') {
        return (
          <div className='flex flex-col'>
            <div className='text-sm text-gray-900 mb-1.5'>
              Updated Planning Application #
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-gray-500 line-through'>{data.oldVal}</span>
              <span className='text-gray-400'>→</span>
              <span className='text-gray-900 font-medium'>{data.val}</span>
            </div>
          </div>
        )
      }

      // Handle regular updates
      switch (updateType) {
        case 'status':
          return renderStatusUpdate()
        case 'description':
          return renderDescriptionUpdate()
        case 'details':
          return renderDetailUpdate()
        case 'images':
          return renderImageUpdate()
        default:
          // For any unhandled update types, show a generic update message
          return (
            <div className='flex flex-col'>
              <div className='text-sm text-gray-900 mb-1.5'>
                Updated {updateType}
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-gray-500 line-through'>{data.oldVal || 'Not set'}</span>
                <span className='text-gray-400'>→</span>
                <span className='text-gray-900 font-medium'>{data.val}</span>
              </div>
            </div>
          )
      }
    }

    // For any unhandled operations, return null to prevent empty cards
    return null
  }

  // Only render the card if there's content to show
  const content = renderContent()
  if (!content) return null

  return (
    <div className='group'>
      <CardWrapper>
        {renderMetadata()}
        {content}
      </CardWrapper>
    </div>
  )
}

function TimelineNav ({ dates, activeDate, onDateClick, groupedThreads }) {
  return (
    <div className='hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-30'>
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-2'>
        <div className='flex flex-col gap-2'>
          {dates.map((date) => {
            const isActive = date === activeDate
            const updateCount = groupedThreads[date]?.length || 0
            return (
              <button
                key={date}
                onClick={() => onDateClick(date)}
                className='group relative flex items-center'
              >
                <div className={`
                  absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-sm
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap flex items-center gap-2
                `}>
                  <span>{date}</span>
                  <span className='px-1.5 py-0.5 bg-gray-700 rounded text-xs font-medium'>
                    {updateCount} {updateCount === 1 ? 'update' : 'updates'}
                  </span>
                </div>
                <div className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${isActive ? 'bg-gray-800 scale-125' : 'bg-gray-300 group-hover:bg-gray-400'}
                `} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Thread ({ thread, unit = 'updates', global = false }) {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const loadMoreRef = useRef(null)
  const threadList = useGlobalThreadListStore(state => state.list)
  const totalItems = useGlobalThreadListStore(state => state.originalList.length)
  const [stickyHeaderRefs] = useState(new Map())
  const [activeDate, setActiveDate] = useState(null)

  // Filter and group updates by date
  const groupedThreads = useMemo(() => {
    const filteredList = threadList.filter(post => {
      if (activeFilter === 'all') return true
      const category = post.path?.[1] === 'images'
        ? 'image'
        : post.path?.[1] === 'docs'
          ? 'document'
          : post.path?.[1] === 'status'
            ? 'status'
            : post.path?.[1] === 'details'
              ? 'detail'
              : 'other'
      return category === activeFilter
    })

    // Group by date and filter out empty groups
    const groups = filteredList.reduce((acc, post) => {
      const date = new Date(Number(post.timestamp))
      const dateKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Only add posts that have valid content
      if (isValidPost(post)) {
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(post)
      }
      return acc
    }, {})

    // Remove dates with no valid posts
    return Object.fromEntries(
      Object.entries(groups).filter(([_, posts]) => posts.length > 0)
    )
  }, [threadList, activeFilter])

  useEffect(() => {
    if (thread.length > 0) setLoading(false)
  }, [thread])

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !loadingMore && threadList.length < totalItems) {
          setLoadingMore(true)
          try {
            const hasMore = useGlobalThreadListStore.getState().loadMore()
            if (!hasMore) {
              observer.disconnect()
            }
          } catch (error) {
            console.error('Error loading more items:', error)
          } finally {
            setLoadingMore(false)
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [loadingMore, threadList.length, totalItems])

  const onSearch = _.debounce((e) => {
    const newList = useGlobalThreadListStore.getState().applyFilter(e.target.value)
    useGlobalThreadListStore.getState().update(newList)
  }, 100)

  const filterConfig = {
    all: {
      label: (
        <div className='flex items-center gap-2'>
          Threads
          <span className='px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium'>
            New
          </span>
        </div>
      ),
      icon: PencilSquareIcon,
      activeClass: 'bg-gray-900 text-white ring-1 ring-gray-900',
      defaultClass: 'bg-white text-gray-600 hover:text-gray-900 ring-1 ring-gray-200 hover:ring-gray-300'
    },
    image: {
      label: 'Photos',
      icon: CameraIcon,
      activeClass: 'bg-blue-600 text-white ring-1 ring-blue-600',
      defaultClass: 'bg-white text-gray-600 hover:text-blue-600 ring-1 ring-gray-200 hover:ring-blue-200'
    },
    document: {
      label: 'Documents',
      icon: DocumentIcon,
      activeClass: 'bg-amber-600 text-white ring-1 ring-amber-600',
      defaultClass: 'bg-white text-gray-600 hover:text-amber-600 ring-1 ring-gray-200 hover:ring-amber-200'
    },
    status: {
      label: 'Status',
      icon: ArrowPathIcon,
      activeClass: 'bg-rose-600 text-white ring-1 ring-rose-600',
      defaultClass: 'bg-white text-gray-600 hover:text-rose-600 ring-1 ring-gray-200 hover:ring-rose-200'
    },
    detail: {
      label: 'Details',
      icon: InformationCircleIcon,
      activeClass: 'bg-emerald-600 text-white ring-1 ring-emerald-600',
      defaultClass: 'bg-white text-gray-600 hover:text-emerald-600 ring-1 ring-gray-200 hover:ring-emerald-200'
    }
  }

  const hasMore = threadList.length < totalItems

  // Setup intersection observer for sticky headers
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 1],
      rootMargin: '-1px 0px 0px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const header = entry.target
        if (entry.intersectionRatio < 1) {
          header.classList.add('shadow')
        } else {
          header.classList.remove('shadow')
        }
      })
    }, observerOptions)

    // Observe all sticky headers
    stickyHeaderRefs.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [stickyHeaderRefs])

  const scrollToDate = (date) => {
    setActiveDate(date)
    const element = document.getElementById(`date-${date}`)
    if (element) {
      const offset = element.getBoundingClientRect().top + window.pageYOffset - 100
      window.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  return (
    <div className='container mx-auto px-4 py-4'>
      <TimelineNav
        dates={Object.keys(groupedThreads)}
        activeDate={activeDate}
        onDateClick={scrollToDate}
        groupedThreads={groupedThreads}
      />
      <div className='flex flex-col mb-4'>
        {global && (
          <>
            <div className='max-w-2xl mx-auto w-full mb-4 relative'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
              </div>
              <input
                className='w-full bg-white rounded-2xl pl-10 pr-6 py-3.5 shadow-sm border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none placeholder:text-gray-400'
                placeholder='Search for projects or meetings...'
                name='global-search'
                onChange={onSearch}
              />
            </div>
            <div className='max-w-2xl mx-auto w-full mb-6'>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-wrap gap-2 justify-center'>
                  {Object.entries(filterConfig).map(([key, config]) => {
                    const Icon = config.icon
                    const isActive = activeFilter === key
                    const count = threadList.filter(post => {
                      const category = post.type === 'meeting'
                        ? 'meeting'
                        : post.path?.[1] === 'images'
                          ? 'image'
                          : post.path?.[1] === 'docs'
                            ? 'document'
                            : post.path?.[1] === 'status'
                              ? 'status'
                              : post.path?.[1] === 'details'
                                ? 'detail'
                                : 'other'
                      return category === key
                    }).length

                    return (
                      <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`
                          px-4 py-2.5 rounded-xl text-sm font-medium 
                          transition-all duration-200 flex items-center gap-2.5 shadow-sm
                          ${isActive ? config.activeClass : config.defaultClass}
                          ${isActive ? '' : 'hover:bg-gray-50 hover:ring-2'}
                        `}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        <div className='flex items-center gap-2'>
                          {config.label}
                          {key !== 'all' && (
                            <span className={`
                              px-2 py-0.5 rounded-full text-xs font-medium
                              ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
                            `}>
                              {count}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className='flex items-center gap-2 justify-center text-xs text-gray-500'>
                  <span>Filter by type</span>
                  <span>•</span>
                  <span>{Object.values(groupedThreads).flat().length} of {totalItems} updates</span>
                </div>
              </div>
            </div>
          </>
        )}
        <div className='text-center text-gray-600 text-sm font-medium'>
          {loading
            ? <span className='animate-pulse'>Loading...</span>
            : <span>{Object.values(groupedThreads).flat().length} of {totalItems} {unit}</span>
          }
        </div>
      </div>

      {loading && <PostPlaceholder />}

      <div className='w-full flex flex-col items-center'>
        {Object.entries(groupedThreads).map(([date, posts]) => (
          <div key={date} id={`date-${date}`} className='w-full max-w-2xl mb-6'>
            {posts.length > 0 ? (
              <>
                <div
                  ref={el => {
                    el && stickyHeaderRefs.set(date, el)
                    if (el) {
                      const observer = new IntersectionObserver(
                        ([entry]) => {
                          if (entry.isIntersecting) {
                            setActiveDate(date)
                          }
                        },
                        { threshold: 1 }
                      )
                      observer.observe(el)
                      return () => observer.disconnect()
                    }
                  }}
                  className='sticky top-[4.5rem] z-20'
                >
                  <div className='relative'>
                    <div className='absolute inset-x-0 h-full bg-white/95 backdrop-blur-md'></div>
                    <div className='relative max-w-2xl mx-auto py-3.5'>
                      <div className='flex items-center justify-between px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-1.5 h-1.5 rounded-full bg-gray-400'></div>
                          <div className='text-sm font-semibold text-gray-700'>
                            {date}
                          </div>
                        </div>
                        <div className='text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full ring-1 ring-gray-200/50'>
                          {posts.length} updates
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='space-y-4 relative mt-3 px-0'>
                  {posts.map((post, i) => (
                    <Post key={`${post.projectId}-${i}`} data={post} />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ))}
        {Object.values(groupedThreads).flat().length === 0 && !loading && (
          <div className='flex flex-col items-center justify-center py-12 px-4'>
            <div className='text-sm text-gray-500 text-center'>
              No updates found for this time period
            </div>
          </div>
        )}
        {hasMore && !loading && (
          <div
            ref={loadMoreRef}
            className='w-full max-w-2xl py-8 flex justify-center px-6'
          >
            <div className={`text-gray-500 ${loadingMore ? 'animate-pulse' : ''} py-4 px-6 bg-gray-50/50 rounded-full`}>
              {loadingMore ? 'Loading more...' : 'Scroll to load more'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { Post }
