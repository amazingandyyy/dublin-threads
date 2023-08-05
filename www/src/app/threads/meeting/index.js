import { PostCard } from '../templates'
import Link from 'next/link'
import { timeSince } from '@/utils'

function transformTimestamp (timestamp) {
  const days = 1000 * 60 * 60 * 24 * 365 // 365 days
  if (Date.now() - timestamp < 0) {
    return 'in ' + timeSince(timestamp)
  }
  if (Date.now() - timestamp < days) {
    return timeSince(timestamp) + ' ago'
  }
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-US', {
    year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  })
}
export default function MeetingPost ({ data }) {
	const isUpComing = Boolean(Date.now() - data.timestamp < 0)
  return (<PostCard>
		<div className='flex items-start justify-between pb-4'>
			<div className='flex-none w-60 md:w-96 items-start flex-col md:flex-row md:items-center'>
				<Link href={`/org/${data.orgId}`} className='hover:opacity-50 active:opacity-70 hover:underline'>
					<div className='font-semibold pr-1 text-base truncate ...'>{data.organizor}</div>
				</Link>
				<Link href={`/org/${data.orgId}`} className='hover:opacity-50 active:opacity-70'><div className='text-gray-500 text-sm'>@{data.orgId}</div></Link>
			</div>
			<div className='relative'>
				<div className='pl-1 text-gray-500 text-xs'>{transformTimestamp(data.timestamp)}</div>
				{isUpComing && <div className='inline-block absolute bg-green-400 text-green-800 px-2 -top-8 -left-4 rounded-full text-sm rotate-[5deg] md:-rotate-[5deg] shadow-xl'>upcoming</div>}
			</div>
		</div>
		<div className='flex flex-col'>
			<div className='font-bold'>🗣️ <span className={data.cancelled && 'line-through opacity-50'}>{data.date} {data.name}</span></div>
			{data.agenda && <div>
				You can find the <a className='text-green-800 pt-2 inline-block' href={`${data.agenda}`} target='_blank' rel='noreferrer'>Agenda here</a>
			</div>}
			{data.agendaPacket && <div>
				<a className='text-green-800 pt-2 inline-block' href={`${data.agendaPacket}`} target='_blank' rel='noreferrer'>Agenda Packet</a> is available
			</div>}
			{data.video && <div>
				<a className='text-green-800 pt-2 inline-block' href={`${data.video}`} target='_blank' rel='noreferrer'>Video</a> is available
			</div>}
			{data.minutes && <div>
				<a className='text-green-800 pt-2 inline-block' href={`${data.minutes}`} target='_blank' rel='noreferrer'>Minutes</a> is available
			</div>}
		</div>
		<div className='flex mt-4 text-green-600 text-sm truncate ...'>
			<div className='pr-1'>#{data.orgId}</div>
			<div className='pr-1'>#meeting</div>
			{data.cancelled && <div className='pr-1'>#cancelled</div>}
			{isUpComing && <div className='pr-1'>#upcoming</div>}
		</div>
	</PostCard>)
}
