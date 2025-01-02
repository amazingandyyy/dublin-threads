import Header from '../header'
import Bottom from '../bottom'
import { PostImages, PostDocs, PostCard } from '../templates'
import { Image } from '@/utils'
import { CakeIcon } from '@heroicons/react/20/solid'

// function ImageLoader() {
//   return (<div className='animate-pulse'><div className="h-24 w-24 rounded cursor-wait bg-gray-200" /></div>)
// }

// function hoorayEmoji (n) {
//   const d = ['🥳', '🎉', '👏', '🙌', '📣', '🎊', '🤩']
//   return d[n % d.length + 0]
// }

function checkType (data) {
  switch (true) {
    case Object.keys(data.val).includes('original'):
      return 'images'
    case Object.keys(data.val).includes('name', 'url'):
      return 'docs'
    default:
      return data.path[1]
  }
}

function PostBody ({ data }) {
  switch (checkType(data)) {
    case 'details':
      if (typeof data.val === 'string') {
        return (<p>Set <i>{data.path[2]}</i> to <i>{data.val}</i> in the details</p>)
      }
      return (<p>Updated details</p>)
    case 'status':
      return (<p>Change status to <span className='font-bold'>{data.val}</span></p>)
    case 'docs':
      return (<PostDocs data={data} />)
    case 'images':
      return (<PostImages data={data} />)
    default:
      console.log(data)
      return (<p>Updates to <i>{data.val}</i></p>)
  }
}

export default function AddPost ({ data }) {
  const isNewPost = Boolean(data.val.title)
  if (!isNewPost) {
    return (
      <PostCard>
        <Header data={data} />
        <PostBody data={data} />
        <Bottom data={data} />
      </PostCard>
    )
  }

  const imgs = data.val.images || []
  return (
    <PostCard>
      <Header data={data} />
      <div className='flex flex-col items-center py-8'>
        <div className='flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 w-20 h-20 shadow-lg mb-4'>
          <CakeIcon className='w-12 h-12 text-yellow-500' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>New Project Launched!</h2>
      </div>

      <div className='prose prose-green max-w-none'>
        <p className='text-gray-600 leading-relaxed'>{data.val.description}</p>
      </div>

      {imgs.length > 0 && (
        <div className='mt-8 space-y-6'>
          {imgs.map((img, i) => (
            <div key={`${i}${img.original}`} className='overflow-hidden rounded-2xl shadow-lg'>
              <Image
                className='w-full h-auto transform hover:scale-105 transition-transform duration-300'
                src={img.original}
                alt='Project image'
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
      )}

      <Bottom data={data} />
    </PostCard>
  )
}
