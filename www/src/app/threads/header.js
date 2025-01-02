import { useProjectProfileStore } from '@/stores'
import Link from 'next/link'
import { timeSince } from '@/utils'
import {
  ClockIcon,
  SparklesIcon,
  HashtagIcon
} from '@heroicons/react/24/outline'

const days = 1000 * 60 * 60 * 24 * 14 // 14 days
function transformTimestamp (timestamp) {
  if (Date.now() - timestamp < days) {
    return timeSince(timestamp) + ' ago'
  }
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

function getUpdateType (data) {
  if (data.type === 'meeting') return 'Meeting'
  if (data.path?.[1] === 'images') return 'Image Update'
  if (data.path?.[1] === 'docs') return 'Document Update'
  if (data.path?.[1] === 'status') return 'Status Change'
  if (data.path?.[1] === 'details') return 'Details Update'
  return 'Update'
}

function getUpdateBadgeColor (type) {
  switch (type) {
    case 'Meeting': return 'bg-purple-50 text-purple-700'
    case 'Image Update': return 'bg-blue-50 text-blue-700'
    case 'Document Update': return 'bg-yellow-50 text-yellow-700'
    case 'Status Change': return 'bg-red-50 text-red-700'
    case 'Details Update': return 'bg-green-50 text-green-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

export default function ({ data }) {
  const isNewPost = Boolean(Date.now() - data.timestamp < days)
  const profiles = useProjectProfileStore(state => state.profiles)
  const updateType = getUpdateType(data)
  const badgeColor = getUpdateBadgeColor(updateType)

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex items-start justify-between gap-4'>
        <Link
          href={`/project/${data.projectId}`}
          className='group flex-grow'
        >
          <h3 className='font-medium text-gray-900 group-hover:text-green-700 transition-colors duration-200 line-clamp-2'>
            {profiles[data.projectId].title}
          </h3>
        </Link>
        <div className='flex items-center gap-2 flex-shrink-0'>
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badgeColor}`}>
            {updateType}
          </span>
        </div>
      </div>
      <div className='flex items-center gap-3 text-gray-500 text-xs'>
        <div className='flex items-center gap-1'>
          <ClockIcon className='w-3.5 h-3.5' />
          <span>{transformTimestamp(data.timestamp)}</span>
        </div>
        {isNewPost && (
          <div className='flex items-center gap-1 text-green-700'>
            <SparklesIcon className='w-3.5 h-3.5' />
            <span>New</span>
          </div>
        )}
        <div className='flex items-center gap-1'>
          <HashtagIcon className='w-3.5 h-3.5' />
          <span>{data.projectId}</span>
        </div>
      </div>
    </div>
  )
}
