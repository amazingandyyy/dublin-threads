'use client'
import { Fragment, useEffect, useState, useRef, useMemo } from 'react'
import { useGlobalThreadListStore, useProjectProfileStore } from '@/stores'
import { timeSince } from '@/utils'
import {
  PhotoIcon,
  DocumentIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  NewspaperIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import CommunityPost from './CommunityPost'

// Utility function to validate post content
const isValidPost = (post, threadList = []) => {
  if (!post) return false

  // Handle community posts
  if (post.type === 'post') return true

  if (post.op === 'add' && post.path?.[1] === 'docs') {
    return !!post.val?.url && !!post.val?.name // Validate document has required fields
  }

  if (post.op === 'update') {
    const updateType = post.path?.[1]

    // Validate that we have both old and new values for updates
    if (!post.val) return false

    // Special case for Planning Application updates
    if (updateType === 'details' && post.path?.[2] === 'Planning Application #') {
      return true
    }

    // Handle image updates
    if (updateType === 'images') {
      const imageType = post.path?.[3] // 'original' or 'thumbnail'
      
      if (imageType === 'thumbnail') {
        // Skip thumbnail updates - we'll show the original image update instead
        return false
      }
      
      if (imageType === 'original') {
        // For image updates, validate the URL
        try {
          // eslint-disable-next-line no-unused-vars
          const _ = new URL(post.val)
          return true
        } catch {
          return false
        }
      }
    }

    // Validate regular updates
    switch (updateType) {
      case 'status':
      case 'description':
      case 'details':
        return true
      default:
        return false
    }
  }

  return false
}

const formatPhoneNumber = (str) => {
  // Clean input string
  const cleaned = ('' + str).replace(/\D/g, '')
  // Check if it's a phone number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return str
}

const formatNumber = (str) => {
  // If it looks like a measurement (has numbers followed by text)
  if (/^\d+(\.\d+)?\s*[a-zA-Z\s]+$/.test(str.trim())) {
    const [num, ...units] = str.trim().split(/(\s+)/)
    return `${Number(num).toLocaleString()}${units.join('')}`
  }
  // If it's just a number
  if (/^\d+$/.test(str.trim())) {
    return Number(str).toLocaleString()
  }
  return str
}

const ValueChange = ({ oldText, newText, type = 'text' }) => {
  const processText = (text) => {
    if (type === 'phone') return formatPhoneNumber(text)
    if (type === 'measurement') return formatNumber(text)
    return text
  }

  const oldValue = processText(oldText || '')
  const newValue = processText(newText || '')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Previous</span>
        <div className="text-xs sm:text-sm text-gray-600">{oldValue || 'Not set'}</div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">New</span>
        <div className="text-xs sm:text-sm text-gray-900 font-medium">{newValue}</div>
      </div>
    </div>
  )
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

const findDifferences = (oldText, newText) => {
  // Split into sentences, preserving spaces and punctuation
  const splitSentences = (text) => {
    // Match sentence endings (.!?) followed by space or end of string
    // Also handle special cases like "e.g.", "i.e.", numbers with decimals
    const sentences = text.split(/(?<=[.!?])(?=\s|$)(?<!Mr)(?<!Mrs)(?<!Ms)(?<!Dr)(?<!etc)(?<!vs)(?<!fig)(?<!e\.g)(?<!i\.e)(?<!\s[A-Z])(?<!\d)/)
    return sentences.map(s => s.trim()).filter(s => s.length > 0)
  }

  const sentences1 = splitSentences(oldText || '')
  const sentences2 = splitSentences(newText || '')
  
  let i = 0
  let j = 0
  const result = []
  
  while (i < sentences1.length || j < sentences2.length) {
    if (i >= sentences1.length) {
      // Rest of sentences2 are additions
      result.push({ type: 'added', text: sentences2.slice(j).join(' ') })
      break
    }
    if (j >= sentences2.length) {
      // Rest of sentences1 are deletions
      result.push({ type: 'removed', text: sentences1.slice(i).join(' ') })
      break
    }
    
    if (sentences1[i] === sentences2[j]) {
      // Sentences match
      result.push({ type: 'unchanged', text: sentences1[i] })
      i++
      j++
      continue
    }
    
    // Look ahead to find next match
    let matchFound = false
    for (let look = 1; look < 3; look++) {
      if (sentences1[i + look] === sentences2[j]) {
        // Found match in sentences1, everything before is removed
        result.push({ type: 'removed', text: sentences1.slice(i, i + look).join(' ') })
        i += look
        matchFound = true
        break
      }
      if (sentences1[i] === sentences2[j + look]) {
        // Found match in sentences2, everything before is added
        result.push({ type: 'added', text: sentences2.slice(j, j + look).join(' ') })
        j += look
        matchFound = true
        break
      }
    }
    
    if (!matchFound) {
      // No match found, treat current sentences as replacement
      result.push({ type: 'removed', text: sentences1[i] })
      result.push({ type: 'added', text: sentences2[j] })
      i++
      j++
    }
  }
  
  return result
}

const TextDiff = ({ oldText, newText }) => {
  const differences = findDifferences(oldText || '', newText || '')
  
  return (
    <div className="text-sm leading-relaxed text-gray-600">
      {differences.map((diff, i) => {
        if (diff.type === 'added') {
          return (
            <span key={i} className="bg-emerald-50/50 text-emerald-600 mx-[1px]">
              {diff.text}
            </span>
          )
        }
        if (diff.type === 'removed') {
          return (
            <span key={i} className="bg-rose-50/50 text-rose-500/90 mx-[1px] line-through decoration-rose-300/50">
              {diff.text}
            </span>
          )
        }
        return <span key={i}>{diff.text}</span>
      })}
    </div>
  )
}

function Post ({ data }) {
  // If it's a community post, render the CommunityPost component
  if (data.type === 'post') {
    return <CommunityPost data={data} />
  }

  const profiles = useProjectProfileStore(state => state.profiles)
  const CardWrapper = ({ children }) => (
    <div className='bg-white rounded-none sm:rounded-xl border-y sm:border border-gray-100'>
      <div className='px-3 sm:px-4 py-3 sm:py-4'>
        {children}
      </div>
    </div>
  )

  const renderMetadata = () => {
    const profile = profiles[data.projectId]
    if (!profile) return null

    return (
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4'>
        <div className='flex-1 min-w-0'>
          <Link
            href={`/project/${data.projectId}`}
            className='group inline-flex items-center gap-2'
          >
            <h3 className='text-sm sm:text-base font-medium text-gray-900 group-hover:text-green-700 transition-colors duration-200 truncate'>
              {profile.title}
            </h3>
            <ArrowTopRightOnSquareIcon className='w-4 h-4 text-gray-400 group-hover:text-green-600 flex-shrink-0' />
          </Link>
          <p className='text-xs text-gray-500 truncate mt-0.5'>
            {profile.location}
          </p>
        </div>
        <div className='flex items-center gap-2 flex-shrink-0 text-xs sm:text-sm'>
          <span className='text-gray-500'>
            {timeSince(data.timestamp)} ago
          </span>
        </div>
      </div>
    )
  }

  const renderDocumentAdd = () => {
    const docInfo = data.val
    return (
      <div className='flex flex-col'>
        <div className='text-sm text-gray-600 mb-3'>
          New document added
        </div>
        <div className='bg-white rounded-xl overflow-hidden border border-gray-100/75 shadow-sm hover:border-amber-200/50 hover:shadow-md transition-all duration-200'>
          <a
            href={docInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className='flex items-start gap-4 p-5 group'
          >
            <div className='bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 rounded-xl flex-shrink-0 border border-amber-100/50 group-hover:scale-105 transition-transform duration-200'>
              <DocumentIcon className='w-6 h-6 text-amber-600' />
            </div>
            <div className='flex-grow min-w-0'>
              <div className='text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors duration-200 line-clamp-2'>
                {docInfo.name}
              </div>
              <div className='text-xs text-gray-500 mt-2 flex items-center gap-1.5'>
                <ArrowTopRightOnSquareIcon className='w-3.5 h-3.5' />
                <span className='group-hover:text-amber-600 transition-colors duration-200'>Open document</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    )
  }

  const renderStatusUpdate = ({ oldVal, val }) => {
    return (
      <div className='flex flex-col'>
        <div className='text-xs sm:text-sm text-gray-600 mb-3'>
          Status changed
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-xl border border-gray-100/75 shadow-sm'>
            <div className='text-xs text-gray-400 uppercase tracking-wider font-medium mb-1'>From</div>
            <div className='text-xs sm:text-sm text-gray-600 break-words'>{oldVal}</div>
          </div>
          <div className='flex justify-center text-gray-400'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transform rotate-90">
              <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </div>
          <div className='flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-xl border border-gray-100/75 shadow-sm'>
            <div className='text-xs text-gray-400 uppercase tracking-wider font-medium mb-1'>To</div>
            <div className='text-xs sm:text-sm text-gray-900 font-medium break-words'>{val}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderDescriptionUpdate = ({ oldVal, val }) => {
    return (
      <div className='flex flex-col'>
        <div className='text-xs sm:text-sm text-gray-600 mb-3'>
          Description updated
        </div>
        <div className='px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-xl border border-gray-100/75 shadow-sm'>
          <TextDiff oldText={oldVal} newText={val} />
        </div>
      </div>
    )
  }

  const renderDetailUpdate = (data) => {
    const fieldName = data.path[2]
    return (
      <div className='flex flex-col'>
        <div className='text-xs sm:text-sm text-gray-600 mb-3'>
          Updated {fieldName}
        </div>
        <div className='px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-xl border border-gray-100/75 shadow-sm'>
          <ValueChange oldText={data.oldVal || 'Not set'} newText={data.val} />
        </div>
      </div>
    )
  }

  const renderImageUpdate = () => {
    // Handle both direct URL and object with original property
    const src = typeof data.val === 'string' ? data.val : data.val?.original
    if (!src) return null

    // Validate URL
    try {
      // eslint-disable-next-line no-unused-vars
      const _ = new URL(src)
    } catch {
      return null
    }

    return (
      <div className='flex flex-col'>
        <div className='text-xs sm:text-sm text-gray-600 mb-3'>
          Added new image
        </div>
        <div className='overflow-hidden rounded-xl border border-gray-100/75 shadow-sm'>
          <img
            src={src}
            alt='Project update'
            className='w-full h-auto object-cover hover:scale-105 transition-transform duration-300'
          />
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
        return renderDetailUpdate(data)
      }

      // Handle regular updates
      switch (updateType) {
        case 'status':
          return renderStatusUpdate(data)
        case 'description':
          return renderDescriptionUpdate(data)
        case 'details':
          return renderDetailUpdate(data)
        case 'images':
          return renderImageUpdate()
        default:
          // For any unhandled update types, show a generic update message
          return (
            <div className='flex flex-col'>
              <div className='text-sm text-gray-600 mb-3'>
                Updated {updateType}
              </div>
              <div className='px-6 py-4 bg-white rounded-xl border border-gray-100/75 shadow-sm'>
                <ValueChange oldText={data.oldVal || 'Not set'} newText={data.val} />
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
    <div className='hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40'>
      <div className='bg-white/40 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100/50 p-2.5'>
        <div className='flex flex-col gap-2.5'>
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
                  absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-gray-800/90 text-white text-sm
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap flex items-center gap-2 backdrop-blur-sm
                `}>
                  <span>{date}</span>
                  <span className='px-1.5 py-0.5 bg-gray-700/90 rounded text-xs font-medium'>
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
      if (isValidPost(post, threadList)) {
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
    news: {
      label: 'News',
      icon: NewspaperIcon,
      activeClass: 'bg-blue-600 text-white ring-1 ring-blue-600',
      defaultClass: 'bg-white text-gray-600 hover:text-blue-600 ring-1 ring-gray-200 hover:ring-blue-200'
    },
    opinion: {
      label: 'Opinion',
      icon: ChatBubbleLeftIcon,
      activeClass: 'bg-green-600 text-white ring-1 ring-green-600',
      defaultClass: 'bg-white text-gray-600 hover:text-green-600 ring-1 ring-gray-200 hover:ring-green-200'
    },
    image: {
      label: 'Development Images',
      icon: PhotoIcon,
      activeClass: 'bg-blue-600 text-white ring-1 ring-blue-600',
      defaultClass: 'bg-white text-gray-600 hover:text-blue-600 ring-1 ring-gray-200 hover:ring-blue-200'
    },
    document: {
      label: 'Development Documents',
      icon: DocumentIcon,
      activeClass: 'bg-amber-600 text-white ring-1 ring-amber-600',
      defaultClass:
        'bg-white text-gray-600 hover:text-amber-600 ring-1 ring-gray-200 hover:ring-amber-200'
    },
    status: {
      label: 'Development Status',
      icon: ArrowPathIcon,
      activeClass: 'bg-rose-600 text-white ring-1 ring-rose-600',
      defaultClass:
        'bg-white text-gray-600 hover:text-rose-600 ring-1 ring-gray-200 hover:ring-rose-200'
    },
    detail: {
      label: 'Development Details',
      icon: InformationCircleIcon,
      activeClass: 'bg-emerald-600 text-white ring-1 ring-emerald-600',
      defaultClass:
        'bg-white text-gray-600 hover:text-emerald-600 ring-1 ring-gray-200 hover:ring-emerald-200'
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
    <div>
      <div className="container mx-auto px-0 sm:px-2 py-0">
        <TimelineNav
          dates={Object.keys(groupedThreads)}
          activeDate={activeDate}
          onDateClick={scrollToDate}
          groupedThreads={groupedThreads}
        />
        <div className="flex flex-col mb-4">
          {global && (
            <div className="max-w-2xl mx-auto w-full mb-6 px-3 sm:px-2">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(filterConfig).map(([key, config]) => {
                    const Icon = config.icon
                    const isActive = activeFilter === key
                    const count = threadList.filter((post) => {
                      if (key === 'all') return true
                      
                      // For images, validate URL in addition to checking type
                      if (post.path?.[1] === 'images') {
                        if (post.path?.[3] === 'thumbnail') return false
                        if (post.path?.[3] === 'original') {
                          try {
                            // eslint-disable-next-line no-unused-vars
                            const _ = new URL(post.val)
                            return key === 'image'
                          } catch {
                            return false
                          }
                        }
                        return false
                      }

                      const category =
                        post.type === 'meeting'
                          ? 'meeting'
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
                          px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium 
                          transition-all duration-200 flex items-center gap-2 shadow-sm
                          ${isActive ? config.activeClass : config.defaultClass}
                          ${isActive ? '' : 'hover:bg-gray-50 hover:ring-2'}
                        `}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`}
                        />
                        <div className="flex items-center gap-2">
                          {config.label}
                          {key !== 'all' && (
                            <span
                              className={`
                              px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium
                              ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 text-gray-500'
                              }
                            `}
                            >
                              {count}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2 justify-center text-xs text-gray-500">
                  <span>Filter by type</span>
                  <span>•</span>
                  <span>
                    {Object.values(groupedThreads).flat().length} of{' '}
                    {totalItems} updates
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="text-center text-gray-600 text-sm font-medium px-3 sm:px-0">
            {loading && <span className="animate-pulse">Loading...</span>}
          </div>
        </div>

        {loading && <PostPlaceholder />}

        <div className="w-full flex flex-col items-center">
          {Object.entries(groupedThreads).map(([date, posts]) => (
            <div
              key={date}
              id={`date-${date}`}
              className="w-full sm:max-w-2xl mb-4 sm:mb-6"
            >
              {posts.length > 0
                ? (
                <>
                  <div
                    ref={(el) => {
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
                    className="sticky sm:top-[4rem] top-[3rem] z-20"
                  >
                    <div className="relative">
                      <div className="absolute inset-x-0 h-full bg-white/90 backdrop-blur-2xl"></div>
                      <div className="relative mx-auto sm:py-3 py-3">
                        <div className="flex items-center justify-between px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            <div className="text-sm font-semibold text-gray-700">
                              {date}
                            </div>
                          </div>
                          <div className="text-xs font-medium px-3 py-1.5 bg-gray-100/80 text-gray-500 rounded-full ring-1 ring-gray-200/50">
                            {posts.length} updates
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 sm:space-y-4 relative mt-4">
                    {posts.map((post, i) => (
                      <div
                        key={`${post.projectId}-${i}`}
                        className="px-0 sm:px-0"
                      >
                        <Post data={post} />
                      </div>
                    ))}
                  </div>
                </>
                  )
                : null}
            </div>
          ))}
          {Object.values(groupedThreads).flat().length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-sm text-gray-500 text-center">
                No updates found for this time period
              </div>
            </div>
          )}
          {hasMore && !loading && (
            <div
              ref={loadMoreRef}
              className="w-full sm:max-w-2xl py-8 flex justify-center px-3 sm:px-6"
            >
              <div
                className={`text-gray-500 ${
                  loadingMore ? 'animate-pulse' : ''
                } py-4 px-6 bg-gray-50/50 rounded-full`}
              >
                {loadingMore ? 'Loading more...' : 'Scroll to load more'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export { Post }

