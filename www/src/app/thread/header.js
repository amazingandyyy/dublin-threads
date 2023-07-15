import { useProjectProfileStore } from '../stores'

function transformTimestamp(timestamp) {
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-US', { 
    year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false
  })
}

export default function ({data}) {
  const profiles = useProjectProfileStore(state => state.profiles)
    return (<div className='flex items-start justify-between pb-4'>
      <div className='flex items-start flex-col md:flex-row md:items-center'>
        <div className='font-semibold text-base max-w-sm '>{profiles[data.projectId].title}</div>
        <div className='pl-1 text-gray-500 text-sm'>@{data.projectId}</div>
      </div>
      <div>
        <div className='pl-1 text-gray-500 text-sm'>{transformTimestamp(data.timestamp)}</div>
      </div>
    </div>)
}