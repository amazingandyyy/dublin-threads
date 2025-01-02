import Header from '../header'
import Bottom from '../bottom'
import { PostImages, PostDocs } from '../templates'

function postBody (data) {
  // For image updates, only show if it's the original image update and has valid content
  if (data.path?.[1] === 'images') {
    // Only show the first image update in a batch
    const isFirstImageUpdate = data.path?.[2] === '0' || !data.path?.[2]
    const isOriginalImage = data.path?.[3] === 'original'
    const hasValidImage = Boolean(data.val)

    if (isFirstImageUpdate && isOriginalImage && hasValidImage) {
      const imageComponent = <PostImages data={data} original={data.val} />
      // Only return if the image component renders successfully
      if (imageComponent) {
        return imageComponent
      }
    }
    return null
  }

  if (typeof data.val === 'string') {
    switch (data.path[1]) {
      case 'details':
        switch (data.path[2]) {
          case 'Project Planner':
            return (
              <div className='text-gray-700'>
                Updated <span className='font-medium'>{data.path[2]}&apos;s {data.path[3]}</span> from{' '}
                <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
                <span className='text-green-700 font-medium'>{data.val}</span>
              </div>
            )
          default:
            return (
              <div className='text-gray-700'>
                Updated <span className='font-medium'>{data.path[2]}</span> from{' '}
                <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
                <span className='text-green-700 font-medium'>{data.val}</span>
              </div>
            )
        }
      case 'title':
        return (
          <div className='text-gray-700'>
            Changed <span className='font-medium'>{data.path[1]}</span> from{' '}
            <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
            <span className='text-green-700 font-medium'>{data.val}</span>
          </div>
        )
      case 'status':
        return (
          <div className='text-gray-700'>
            Moved <span className='font-medium'>{data.path[1]}</span> from{' '}
            <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
            <span className='text-green-700 font-medium'>{data.val}</span>
          </div>
        )
      case 'location':
        return (
          <div className='text-gray-700'>
            Changed <span className='font-medium'>location</span> from{' '}
            <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
            <span className='text-green-700 font-medium'>{data.val}</span>
          </div>
        )
      case 'geolocation':
        return null
      case 'description':
        return (
          <div className='prose prose-green max-w-none'>
            <p className='text-gray-600 leading-relaxed'>{data.val}</p>
          </div>
        )
      case 'docs':
        return <PostDocs data={data} url={data.val} />
      default:
        return null
    }
  }
  return null
}

export default function UpdatePost ({ data }) {
  const body = postBody(data)
  // Don't render anything if there's no content
  if (!body) return null

  return (
    <div className='flex flex-col space-y-4'>
      <Header data={data} />
      {body}
      <Bottom data={data} />
    </div>
  )
}
