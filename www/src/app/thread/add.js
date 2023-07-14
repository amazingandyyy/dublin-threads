import Image from 'next/image'
import { useEffect, useState } from 'react'

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
  const img = data.val.images[0]?.original
  const [src, setSrc] = useState(img)
  useEffect(() => { setSrc(img) }, [img])
  return <div>
    <div className='flex items-center justify-between pb-4'>
      <div className='flex items-center'>
        <div className='font-semibold text-base'>{data.val.title}</div>
        <div className='pl-1 text-gray-500 text-sm'>@{data.projectId}</div>
      </div>
      <div>
      <div className='pl-1 text-gray-500 text-sm'>{transformTimestamp(data.timestamp)}</div>
      </div>
    </div>
    <div className='pb-4'>
      New Project Added! {hoorayEmoji(String(data.val.title).length)}
    </div>
    <div className='pb-4'>
      {data.val.description}
    </div>
    <div className='pb-4 text-green-600 text-sm'>
      #{data.val.title.replace(/\s/g, '')}
    </div>
    <div>
    {img && <Image 
      src={src}
      alt={data.val.title}
      width={500}
      height={500}
      blurDataURL='/images/beams.jpg'
      onError={() => setSrc('/images/beams.jpg')}
    />}
    </div>
  </div>
}
