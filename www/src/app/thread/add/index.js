import { useEffect } from 'react'

import Image from './image'

// function ImageLoader() {
//   return (<div className='animate-pulse'><div className="h-24 w-24 rounded cursor-wait bg-gray-200" /></div>)
// }

function transformTimestamp(timestamp) {
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-US', { 
    year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false
  })
}

function hoorayEmoji(n) {
  const d = ['🥳','🎉','👏', '🙌', '📣', '🎊', '🤩']
  return d[n%d.length+0]
}

export default function ({ data }) {
  const isNewPost = Boolean(data.val.title)
  if(!isNewPost) {
    console.log("is not new post", data)
    return <div>
      {/* {data.val.title} */}
    </div>
  }
  console.log("is new post", data)

  const imgs = data.val.images || []
  return <div>
    <div className='flex items-start justify-between pb-4'>
      <div className='flex items-start flex-col md:flex-row md:items-center'>
        <div className='font-semibold text-base max-w-sm'>{data.val.title}</div>
        <div className='pl-1 text-gray-500 text-sm'>@{data.projectId}</div>
      </div>
      <div>
      <div className='pl-1 text-gray-500 text-sm'>{transformTimestamp(data.timestamp)}</div>
      </div>
    </div>
    <div className='pb-4 flex'>
      <p>New Project Added! {hoorayEmoji(String(data.val.title).length)}</p>
      {data.val.images?.length > 0 && <p className='pl-2'>with {data.val.images?.length} photos</p>}
    </div>
    <div className='pb-4'>
      {data.val.description}
    </div>
    <div className='pb-4 text-green-600 text-sm'>
      #{data.val.title.replace(/\s/g, '').replace(/[^a-zA-Z0-9 ]/ig, '')}
    </div>
    <div className='flex flex-row overflow-x-scroll'>
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
  </div>
}
