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

  // Skip thumbnail updates
  if (data.path?.[3] === 'thumbnail') return null

  return (
    <div className='flex flex-col'>
      <div className='overflow-hidden rounded-lg mt-2'>
        <Image
          className='w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300'
          src={src}
          alt='Project update image'
        />
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <div className='px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium'>
          {data.op === 'add' ? '+ Added new image' : '↻ Updated image'}
        </div>
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
        <div className='px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium inline-flex items-center w-fit'>
          {data.op === 'add' ? '+ Added new document' : '↻ Updated document'}
        </div>
        <a
          href={url}
          target='_blank'
          className='group flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'
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
    <div className='w-full max-w-3xl mx-auto mb-4'>
      <div className='bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6'>
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
