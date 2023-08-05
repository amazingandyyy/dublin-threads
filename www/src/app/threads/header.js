import { useProjectProfileStore } from '@/stores'
import Link from 'next/link'
import { timeSince } from '@/utils'

function transformTimestamp (timestamp) {
  const days = 1000 * 60 * 60 * 24 * 14 // 14 days
  if (Date.now() - timestamp < days) {
    return timeSince(timestamp) + ' ago'
  }
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-US', {
    year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  })
}

export default function ({ data }) {
  // const isNewPost = Boolean(Date.now() - data.timestamp < days / 12)
  const profiles = useProjectProfileStore(state => state.profiles)
  return (<div className='flex items-start justify-between pb-4'>
      <div className='flex-none w-60 md:w-96 items-start flex-col md:flex-row md:items-center'>
        <Link href={`/project/${data.projectId}`} className='hover:opacity-50 active:opacity-70 hover:underline'>
          <div className='font-semibold pr-1 text-base truncate ...'>{profiles[data.projectId].title}</div>
        </Link>
        <Link href={`/project/${data.projectId}`} className='hover:opacity-50 active:opacity-70'><div className='text-gray-500 text-sm'>@{data.projectId}</div></Link>
      </div>
      <div className='relative'>
        <div className='pl-1 text-gray-500 text-xs'>{transformTimestamp(data.timestamp)}</div>
         {/* {isNewPost && <div className='block absolute bg-green-400 text-green-800 px-2 top-8 left-14 rounded-full text-sm rotate-[5deg] md:-rotate-[5deg] shadow-2xl'>NEW</div>} */}
      </div>
    </div>)
}
