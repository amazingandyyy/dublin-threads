import Image from '../image'
import Header from '../header'
import Bottom from '../bottom'

// function ImageLoader() {
//   return (<div className='animate-pulse'><div className="h-24 w-24 rounded cursor-wait bg-gray-200" /></div>)
// }

function hoorayEmoji(n) {
  const d = ['🥳','🎉','👏', '🙌', '📣', '🎊', '🤩']
  return d[n%d.length+0]
}

function PostBody({data}) {
  switch (data.path[0]) {
    case 'details':
      if(typeof data.val === 'string') {
        return (<p>Set <i>{data.path[1]}</i> to <i>{data.val}</i> in the details</p>)
      }
      return (<p>Updated details</p>)
    case 'docs':
      return (<div className='flex flex-col w-full'>
        <p>Just uploaded a new document</p>
        <br />
        <a href={data.val.url} target='_blank' className='text-green-800 truncate ...'>
          <p className='truncate ...'>📁 {data.val.name}</p>
        </a>
      </div>)
    case 'images':
      return (<div className='flex flex-col'>
        <p>Added a new image to the project!</p>
        <Image
          width='550px'
          style={{ height: '100%' }}
          original={data.val.original}
          thumbnail={data.val.thumbnail}
          alt={data.projectId}
        />
      </div>)
    default:
      // console.log(data.path[0]) // status
      return (<p>Add <i>{data.val}</i> to {data.path[0]}</p>)
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
      {imgs.map((img, i)=><div className='flex border-2 ml-2'>
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
