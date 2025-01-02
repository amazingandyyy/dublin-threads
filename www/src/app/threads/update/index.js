import Header from '../header'
import Bottom from '../bottom'
import { PostImages, PostDocs, PostCard } from '../templates'

// function mainEmoji (n) {
//   const d = ['📣', '🤩']
//   return d[n % d.length + 0]
// }

function PostWrapper ({ data }) {
  const body = postBody(data)
  if (body) {
    return (<PostCard>
      <Header data={data} />
        {body}
      <Bottom data={data} />
    </PostCard>)
  }
  return <></>
}

function postBody (data) {
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
      case 'images':
        if (data.path[3] === 'original') {
          return (
            <div className='mt-4'>
              <PostImages data={data} original={data.val} />
            </div>
          )
        }
        return false
      case 'location':
        return (
          <div className='text-gray-700'>
            Changed <span className='font-medium'>location</span> from{' '}
            <span className='line-through text-gray-400'>{data.oldVal}</span> to{' '}
            <span className='text-green-700 font-medium'>{data.val}</span>
          </div>
        )
      case 'geolocation':
        return false
      case 'description':
        return (
          <div className='prose prose-green max-w-none'>
            <p className='text-gray-600 leading-relaxed'>{data.val}</p>
          </div>
        )
      case 'docs':
        return (
          <div className='mt-4'>
            <PostDocs data={data} url={data.val} />
          </div>
        )
      default:
        return false
    }
  }
  return false
}

export default function UpdatePost ({ data }) {
  return (
    <PostCard>
      <Header data={data} />
      <div className='mt-4'>{postBody(data)}</div>
      <Bottom data={data} />
    </PostCard>
  )
}
