import { Image, useArchivedSource } from '@/utils'
import { DocumentIcon } from '@heroicons/react/24/outline'

const PostImages = ({ data, original = '', thumbnail = '' }) => {
  // Early return if no valid source
  if (!original && !data?.val?.original) return null
  const src = original || data.val?.original
  if (!src || typeof src !== 'string') return null

  // Check if the image is a valid URL
  let isValidUrl = false
  try {
    isValidUrl = Boolean(new URL(src))
  } catch {
    return null
  }
  if (!isValidUrl) return null

  // Check if it's a duplicate update (has same URL as thumbnail)
  if (thumbnail && src === thumbnail) return null

  return (
    <div className='flex flex-col gap-3'>
      <div className='overflow-hidden rounded-lg border border-gray-100'>
        <Image
          className='w-full h-auto object-cover'
          src={src}
          alt='Project update image'
        />
      </div>
      <div className='text-sm text-gray-500'>
        Added new project image
      </div>
    </div>
  )
}

const PostDocs = ({ data, url = '' }) => {
  // Early return if no valid URL
  if (!url && !data?.val?.url) return null
  url = url || data.val?.url
  if (!url || typeof url !== 'string') return null
  url = useArchivedSource(url)
  if (!url) return null

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-2'>
        <a
          href={url}
          target='_blank'
          className='group flex items-center gap-3 py-2'
          rel="noreferrer"
        >
          <div className='flex-shrink-0'>
            <DocumentIcon className='w-5 h-5 text-gray-400 group-hover:text-gray-600' />
          </div>
          <div className='flex-grow min-w-0'>
            <div className='text-sm font-medium text-gray-900 group-hover:text-gray-600 truncate transition-colors duration-200'>
              {data.val?.name || 'Document'}
            </div>
            <div className='text-xs text-gray-500 truncate'>
              View document
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

function PostCard ({ children }) {
  if (!children) return null

  return (
    <div className='w-full max-w-3xl mx-auto mb-3'>
      <div className='bg-white transition-shadow duration-200 rounded-lg p-5'>
        {children}
      </div>
    </div>
  )
}

export {
  PostCard,
  PostImages,
  PostDocs
}
