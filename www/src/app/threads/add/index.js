import Header from '../header'
import Bottom from '../bottom'
import { PostImages, PostDocs, PostCard } from '../templates'

// function ImageLoader() {
//   return (<div className='animate-pulse'><div className="h-24 w-24 rounded cursor-wait bg-gray-200" /></div>)
// }

function hoorayEmoji (n) {
  const d = ['🥳', '🎉', '👏', '🙌', '📣', '🎊', '🤩']
  return d[n % d.length + 0]
}

function checkType (data) {
  switch (true) {
    case Object.keys(data.val).includes('original', 'thumbnail'):
      return 'images'
    case Object.keys(data.val).includes('name', 'url'):
      return 'docs'
    default:
      return data.path[0]
  }
}

function PostBody ({ data }) {
  switch (checkType(data)) {
    case 'details':
      if (typeof data.val === 'string') {
        return (<p>Set <i>{data.path[1]}</i> to <i>{data.val}</i> in the details</p>)
      }
      return (<p>Updated details</p>)
    case 'docs':
      return (<PostDocs data={data} />)
    case 'images':
      return (<PostImages data={data} />)
    default:
      return (<p>Update {data.path[0]} to <i>{data.val}</i></p>)
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
    <div className='py-4 max-w-xs md:max-w-full inlin-block break-words truncate ... text-ellipsis'>
      {data.val.description}
    </div>
    <div className='mt-2 overflow-x-hidden'>
      {imgs.map((img, i) => <div key={`${i}${img.original}`} className='inline-block border-2 ml-2 w-full'>
        <img src={img.original} style={{ width: '100%', height: 'auto' }} alt='' />
      </div>)}
    </div>
    <Bottom data={data} />
  </PostCard>
}
