import { PostCard } from '../templates'
import Link from 'next/link'
import { timeSince } from '@/utils'
import { AddToCalendarButton } from 'add-to-calendar-button-react'

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

  function renderAddToCalendar (data) {
    const a = data.date.split('-')
    const date = `${a[2]}-${a[0]}-${a[1]}`
    return (
      <div className='mt-4'>
        <AddToCalendarButton
          name={data.name}
          options={['Apple', 'Google', 'Yahoo', 'Outlook.com']}
          location={data.video}
          startDate={date}
          endDate={date}
          startTime="19:00"
          endTime="21:00"
          timeZone="America/Los_Angeles"
          buttonStyle="date"
          size="3"
          lightMode="light"
        >
          add to calendar
        </AddToCalendarButton>
      </div>
    )
  }

  return (
    <PostCard>
      <div className='flex items-start justify-between pb-4 border-b border-gray-100'>
        <div className='flex-grow'>
          <Link href={`/org/${data.orgId}`} className='group'>
            <div className='font-semibold text-lg group-hover:text-green-700 transition-colors duration-200'>{data.organizor}</div>
            <div className='text-gray-500 text-sm'>@{data.orgId}</div>
          </Link>
        </div>
        <div className='text-right'>
          <div className='text-gray-500 text-sm'>{transformTimestamp(data.timestamp)}</div>
          {!data.cancelled && isUpComing && (
            <div className='inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mt-2 transform -rotate-2 shadow-sm'>
              upcoming
            </div>
          )}
        </div>
      </div>

      <div className='mt-6'>
        <div className='text-xl font-bold flex items-center gap-2'>
          🗣️ <span className={data.cancelled ? 'line-through text-gray-400' : ''}>
            {data.date} {data.name}
          </span>
        </div>

        {!data.cancelled && isUpComing && renderAddToCalendar(data)}

        <div className='mt-4 space-y-2'>
          {data.agenda && (
            <a href={data.agenda} target='_blank' rel='noreferrer'
               className='block text-green-700 hover:text-green-900 transition-colors duration-200'>
              📄 View Agenda
            </a>
          )}
          {data.agendaPacket && (
            <a href={data.agendaPacket} target='_blank' rel='noreferrer'
               className='block text-green-700 hover:text-green-900 transition-colors duration-200'>
              📋 View Agenda Packet
            </a>
          )}
          {data.video && (
            <a href={data.video} target='_blank' rel='noreferrer'
               className='block text-green-700 hover:text-green-900 transition-colors duration-200'>
              🎥 Watch Video
            </a>
          )}
          {data.minutes && (
            <a href={data.minutes} target='_blank' rel='noreferrer'
               className='block text-green-700 hover:text-green-900 transition-colors duration-200'>
              📝 View Minutes
            </a>
          )}
        </div>
      </div>

      <div className='flex mt-6 pt-4 border-t border-gray-100 text-green-600 text-sm space-x-2'>
        <div>#{data.orgId}</div>
        <div>#meeting</div>
        {data.cancelled && <div>#cancelled</div>}
        {isUpComing && <div>#upcoming</div>}
      </div>
    </PostCard>
  )
}
