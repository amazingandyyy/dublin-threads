import Image from '../image'
import Header from '../header'
import Bottom from '../bottom'
import {PostImages, PostDocs} from '../templates'
// function ImageLoader() {
//   return (<div className='animate-pulse'><div className="h-24 w-24 rounded cursor-wait bg-gray-200" /></div>)
// }

function hoorayEmoji(n) {
  const d = ['🥳','🎉','👏', '🙌', '📣', '🎊', '🤩']
  return d[n%d.length+0]
}

function checkType(data) {
  switch (true) {
    case Object.keys(data.val).includes('original', 'thumbnail'):
      return 'images'
    case Object.keys(data.val).includes('name', 'url'):
        return 'docs'
    default:
      return data.path[0]
  }
}

function PostBody({data}) {
  switch (checkType(data)) {
    case 'details':
      if(typeof data.val === 'string') {
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
  if(!isNewPost) {
    return <div>
      <Header data={data} />
      <PostBody data={data} />
      <Bottom data={data} />
    </div>
  }

  const imgs = data.val.images || []
  return <div>
    <Header data={data} />
    <div>
      <p>New Project Added! {hoorayEmoji(String(data.val.title).length)}</p>
      {data.val.images?.length > 0 && <p className='pl-2'>with {data.val.images?.length} photos</p>}
    </div>
    <div>
      {data.val.description}
    </div>
    <div className='flex mt-2 flex-row overflow-x-scroll'>
      {imgs.map((img, i)=><div key={`${i}${img.original}`} className='flex border-2 ml-2'>
        <Image
          width='550px'
          style={{ height: '100%' }}
          original={img.original}
          thumbnail={img.thumbnail}
          alt={`${data.val.title}-${i}`}
        />
      </div>)}
    </div>
    <Bottom data={data} />
  </div>
}
