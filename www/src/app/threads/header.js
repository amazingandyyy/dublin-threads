import { useProjectProfileStore } from '@/stores'
import { timeSince } from '@/utils'

const days = 1000 * 60 * 60 * 24 * 365 // 365 days

function transformTimestamp (timestamp) {
  if (Date.now() - timestamp < days) {
    return timeSince(timestamp) + ' ago'
  }
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-US', {
    year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  })
}

export default function ({ data }) {
  const isNewPost = Boolean(Date.now() - data.timestamp < days / 12)
  const profiles = useProjectProfileStore(state => state.profiles)
  return (<div className='flex items-start justify-between pb-4'>
      <div className='flex-none w-64 md:w-96 items-start flex-col md:flex-row md:items-center'>
        <div className='font-semibold pr-1 text-base truncate ...'>{profiles[data.projectId].title}</div>
        <div className='text-gray-500 text-sm'>@{data.projectId}</div>
      </div>
      <div className='relative'>
        <div className='pl-1 text-gray-500 text-xs'>{transformTimestamp(data.timestamp)}</div>
        {isNewPost && <div className='block absolute bg-green-400 text-green-800 px-2 -top-8 right-1 md:-right-8 rounded-full text-sm rotate-[5deg] md:-rotate-[5deg] shadow-2xl'>NEW</div>}
      </div>
    </div>)
}
