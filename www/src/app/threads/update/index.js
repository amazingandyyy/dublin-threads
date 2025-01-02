import Header from '../header'
import Bottom from '../bottom'
import { PostImages, PostDocs } from '../templates'

function postBody (data) {
  // For image updates, only show if it's the original image update and has valid content
  if (data.path?.[1] === 'images') {
    // Skip if no value or empty string
    if (!data.val || data.val === '') return null

    // Skip thumbnail updates entirely
    if (data.path?.[3] === 'thumbnail') return null

    // For image updates, we only want to show when:
    // 1. It's an original image (not thumbnail)
    // 2. The URL is valid
    // 3. It's either a new image or an image update
    const isOriginalImage = data.path?.[3] === 'original'
    const isImageUpdate = data.op === 'update' && data.oldVal !== data.val
    const isNewImage = data.op === 'add'
    let isValidUrl = false
    try {
      const url = new URL(data.val)
      isValidUrl = Boolean(url) && data.val.trim() !== ''
    } catch {
      return null
    }

    // Only show if it's a valid original image that's either new or updated
    if (isOriginalImage && isValidUrl && (isNewImage || isImageUpdate)) {
      const imageComponent = <PostImages data={data} original={data.val} />
      // Don't return if the component or its props are empty
      if (!imageComponent || !imageComponent.props?.original) return null
      return imageComponent
    }
    return null
  }

  if (typeof data.val === 'string') {
    // Skip if value is empty or just whitespace
    if (!data.val || data.val.trim() === '') return null

    switch (data.path[1]) {
      case 'details':
        // Skip if old and new values are the same
        if (data.oldVal === data.val) return null
        switch (data.path[2]) {
          case 'Project Planner':
            return (
              <div className='text-gray-700 text-base'>
                Updated <span className='font-medium'>{data.path[2]}&apos;s {data.path[3]}</span> from{' '}
                <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
                <span className='text-green-700 font-medium'>{data.val}</span>
              </div>
            )
          default:
            return (
              <div className='text-gray-700 text-base'>
                Updated <span className='font-medium'>{data.path[2]}</span> from{' '}
                <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
                <span className='text-green-700 font-medium'>{data.val}</span>
              </div>
            )
        }
      case 'title':
        if (data.oldVal === data.val) return null
        return (
          <div className='text-gray-700 text-base'>
            Changed <span className='font-medium'>{data.path[1]}</span> from{' '}
            <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
            <span className='text-green-700 font-medium'>{data.val}</span>
          </div>
        )
      case 'status':
        if (data.oldVal === data.val) return null
        return (
          <div className='text-gray-700 text-base'>
            Moved <span className='font-medium'>{data.path[1]}</span> from{' '}
            <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
            <span className='text-green-700 font-medium'>{data.val}</span>
          </div>
        )
      case 'location':
        if (data.oldVal === data.val) return null
        return (
          <div className='text-gray-700 text-base'>
            Changed <span className='font-medium'>location</span> from{' '}
            <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
            <span className='text-green-700 font-medium'>{data.val}</span>
          </div>
        )
      case 'geolocation':
        return null
      case 'description':
        if (data.oldVal === data.val) return null
        return (
          <div className='prose prose-green max-w-none'>
            <p className='text-gray-600 leading-relaxed text-base'>{data.val}</p>
          </div>
        )
      case 'docs':
        if (!data.val?.url || data.val.url.trim() === '') return null
        return <PostDocs data={data} url={data.val} />
      default:
        return null
    }
  }
  return null
}

export default function UpdatePost ({ data }) {
  // Add validation for required data properties
  if (!data || !data.op || !data.path || !data.type) return null

  // Get the body content
  const body = postBody(data)

  // Don't render anything if there's no content or if the update is not meaningful
  if (!body) return null

  return (
    <div className='flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
      <div className='px-6 pt-6 pb-4'>
        <Header data={data} />
      </div>
      <div className='px-6 pb-4'>
        {body}
      </div>
      <div className='px-6 pb-4 mt-auto'>
        <Bottom data={data} />
      </div>
    </div>
  )
}
