'use client'
import { Fragment, useEffect, useState, useRef, useMemo } from 'react'
import AddPost from './add'
import UpdatePost from './update'
import MeetingPost from './meeting'
import { useGlobalThreadListStore } from '@/stores'
import _ from 'lodash'
import {
  CalendarIcon,
  CameraIcon,
  DocumentIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

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
  const getUpdateCategory = (data) => {
    if (data.type === 'meeting') return 'meeting'
    if (data.path?.[1] === 'images') return 'image'
    if (data.path?.[1] === 'docs') return 'document'
    if (data.path?.[1] === 'status') return 'status'
    if (data.path?.[1] === 'details') return 'detail'
    return 'other'
  }

  const getCategoryIcon = (category) => {
    const iconClasses = 'w-4 h-4'
    const getIconColor = (category) => {
      switch (category) {
        case 'meeting': return 'text-purple-600'
        case 'image': return 'text-blue-600'
        case 'document': return 'text-amber-600'
        case 'status': return 'text-rose-600'
        case 'detail': return 'text-emerald-600'
        default: return 'text-gray-600'
      }
    }

    const getBgColor = (category) => {
      switch (category) {
        case 'meeting': return 'bg-purple-50'
        case 'image': return 'bg-blue-50'
        case 'document': return 'bg-amber-50'
        case 'status': return 'bg-rose-50'
        case 'detail': return 'bg-emerald-50'
        default: return 'bg-gray-50'
      }
    }

    const iconWithBg = (Icon) => (
      <div className={`${getBgColor(category)} p-1.5 rounded-lg`}>
        <Icon className={`${iconClasses} ${getIconColor(category)}`} />
      </div>
    )

    switch (category) {
      case 'meeting':
        return iconWithBg(CalendarIcon)
      case 'image':
        return iconWithBg(CameraIcon)
      case 'document':
        return iconWithBg(DocumentIcon)
      case 'status':
        return iconWithBg(ArrowPathIcon)
      case 'detail':
        return iconWithBg(InformationCircleIcon)
      default:
        return iconWithBg(PencilSquareIcon)
    }
  }

  const category = getUpdateCategory(data)
  const icon = getCategoryIcon(category)

  const CardWrapper = ({ children }) => (
    <div className='bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100/50 transition-all duration-200'>
      <div className='px-6 py-4'>
        <div className='flex flex-col space-y-3'>
          {children}
        </div>
      </div>
    </div>
  )

  const renderPost = (PostComponent) => (
    <div className='group'>
      <CardWrapper>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-gray-600 text-xs font-medium'>
            {icon}
            <span className='capitalize tracking-wide'>{category}</span>
          </div>
          <div className='text-xs text-gray-400'>
            {new Date(Number(data.timestamp)).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
        <PostComponent data={data} />
      </CardWrapper>
    </div>
  )

  switch (data.type) {
    case 'developments:add':
      return renderPost(AddPost)
    case 'developments:update':
      return renderPost(UpdatePost)
    case 'meeting':
      return renderPost(MeetingPost)
    default:
      return (<Fragment></Fragment>)
  }
}

export default function Thread ({ thread, unit = 'updates', global = false }) {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const loadMoreRef = useRef(null)
  const threadList = useGlobalThreadListStore(state => state.list)
  const totalItems = useGlobalThreadListStore(state => state.originalList.length)
  const [stickyHeaderRefs] = useState(new Map())

  // Filter and group updates by date
  const groupedThreads = useMemo(() => {
    const filteredList = threadList.filter(post => {
      if (activeFilter === 'all') return true
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
      return category === activeFilter
    })

    return filteredList.reduce((acc, post) => {
      const date = new Date(Number(post.timestamp))
      const dateKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(post)
      return acc
    }, {})
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
      label: 'All Updates',
      icon: PencilSquareIcon,
      activeClass: 'bg-gray-900 text-white ring-1 ring-gray-900',
      defaultClass: 'bg-white text-gray-600 hover:text-gray-900 ring-1 ring-gray-200 hover:ring-gray-300'
    },
    meeting: {
      label: 'Meetings',
      icon: CalendarIcon,
      activeClass: 'bg-purple-600 text-white ring-1 ring-purple-600',
      defaultClass: 'bg-white text-gray-600 hover:text-purple-600 ring-1 ring-gray-200 hover:ring-purple-200'
    },
    image: {
      label: 'Images',
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
      label: 'Status Changes',
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

  return (
    <div className='container mx-auto px-4 py-4'>
      <div className='flex flex-col mb-4'>
        {global && (
          <>
            <div className='max-w-2xl mx-auto w-full mb-4 relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
              </div>
              <input
                className='w-full bg-white rounded-2xl pl-10 pr-6 py-3 shadow-sm border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none'
                placeholder='Search for projects or meetings...'
                name='global-search'
                onChange={onSearch}
              />
            </div>
            <div className='max-w-2xl mx-auto w-full mb-4'>
              <div className='flex flex-wrap gap-1.5 justify-center'>
                {Object.entries(filterConfig).map(([key, config]) => {
                  const Icon = config.icon
                  const isActive = activeFilter === key
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveFilter(key)}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium 
                        transition-all duration-200 flex items-center gap-2 shadow-sm
                        ${isActive ? config.activeClass : config.defaultClass}
                        ${isActive ? '' : 'hover:bg-gray-50 hover:border-gray-300'}
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {config.label}
                    </button>
                  )
                })}
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
          <div key={date} className='w-full max-w-2xl mb-6'>
            <div
              ref={el => el && stickyHeaderRefs.set(date, el)}
              className='sticky top-[4.5rem] z-20'
            >
              <div className='relative'>
                <div className='absolute inset-x-0 h-full bg-white/95 backdrop-blur-md'></div>
                <div className='relative max-w-2xl mx-auto py-3'>
                  <div className='flex items-center justify-between px-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-1 h-1 rounded-full bg-gray-400'></div>
                      <div className='text-sm font-medium text-gray-700'>
                        {date}
                      </div>
                    </div>
                    <div className='text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full ring-1 ring-gray-200/50'>
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
          </div>
        ))}
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
