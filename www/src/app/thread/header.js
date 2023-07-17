import { useProjectProfileStore } from '../stores'
function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function transformTimestamp(timestamp) {
  if (Date.now()-timestamp < 1000*60*60*24){
    return timeSince(timestamp) + ' ago'
  }
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-US', { 
    year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false
  })
}

export default function ({data}) {
  const isNewPost = Boolean(Date.now() - data.timestamp < 1000*60*60*24)
  const profiles = useProjectProfileStore(state => state.profiles)
    return (<div className='flex items-start justify-between pb-4'>
      <div className='flex items-start flex-col md:flex-row md:items-center'>
        <div className='font-semibold text-base max-w-sm '>{profiles[data.projectId].title}</div>
        <div className='pl-1 text-gray-500 text-sm'>@{data.projectId}</div>
      </div>
      <div className='relative'>
        <div className='pl-1 text-gray-500 text-sm'>{transformTimestamp(data.timestamp)}</div>
        {isNewPost && <div className='shadow-xl block absolute bg-green-400 px-2 top-6 -right-6 text-sm -rotate-[5deg] opacity-80'>NEW</div>}
      </div>
    </div>)
}