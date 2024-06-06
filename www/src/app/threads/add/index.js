import Header from '../header'
import Bottom from '../bottom'
import { PostImages, PostDocs, PostCard } from '../templates'
import { Image } from '@/utils'

// function ImageLoader() {
//   return (<div className='animate-pulse'><div className="h-24 w-24 rounded cursor-wait bg-gray-200" /></div>)
// }

function hoorayEmoji (n) {
  const d = ['🥳', '🎉', '👏', '🙌', '📣', '🎊', '🤩']
  return d[n % d.length + 0]
}

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

export default function ({ data }) {
  const isNewPost = Boolean(data.val.title)
  if (!isNewPost) {
    return <PostCard>
      <Header data={data} />
      <PostBody data={data} />
      <Bottom data={data} />
    </PostCard>
  }

  const imgs = data.val.images || []
  return <PostCard>
    <Header data={data} />
    <div>
      <p className='inline'>New Project Added! {hoorayEmoji(String(data.val.title).length)}</p>
      {data.val.images?.length > 0 && <p className='pl-2 inline'>with {data.val.images?.length} photos</p>}
    </div>
    <div className='py-4 md:max-w-full inlin-block break-words'>
      {data.val.description}
    </div>
    <div className='mt-2 overflow-x-hidden md:max-w-full'>
      {imgs.map((img, i) => <div key={`${i}${img.original}`} className='inline-block w-full'>
        <Image className='rounded-3xl border-4' src={img.original} style={{ width: '100%' }} alt='' />
      </div>)}
    </div>
    <Bottom data={data} />
  </PostCard>
}
