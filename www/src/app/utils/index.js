import Image from './image'
const rootUrl = 'https://raw.githubusercontent.com/amazingandyyy/dublin-threads/main/docs'

const fetchApi = (path) => {
  return fetch(`${rootUrl}${path}`)
}

const useArchivedSource = (url) => {
  // amazingandyyy.com/dublin-threads/web-archive/wp-content/
  // raw.githubusercontent.com/amazingandyyy/dublin-threads/main/docs/web-archive/wp-content/
  return url?.replace('dublin-development.icitywork.com/wp-content/', 'amazingandyyy.com/dublin-threads/web-archive/wp-content/') || url
}

const fetchMeetings = (path) => {
  const meetingsApiUrl = '/api/v2/meetings/'
  return fetchApi(`${meetingsApiUrl}${path}`)
}
const fetchDevelopments = (path) => {
  const developmentsApiUrl = '/api/v2/developments/'
  return fetchApi(`${developmentsApiUrl}${path}`)
}

export function timeSince (timestamp) {
  if (!timestamp) return ''

  let date
  // Handle millisecond timestamps (as string or number)
  if (String(timestamp).length === 13) {
    date = new Date(parseInt(timestamp))
  } else {
    // Handle date strings
    date = new Date(timestamp)
  }

  // Return empty string if date is invalid
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds} seconds`
  if (minutes === 1) return 'a minute'
  if (minutes < 60) return `${minutes} minutes`
  if (hours === 1) return 'an hour'
  if (hours < 24) return `${hours} hours`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days`
  
  // For older dates, show the actual date
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDate (date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// The custom Studio style mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h
// declares "mapbox:sdk-support" of js 3.0.0, but this app pins mapbox-gl 2.15, so
// its tiles never paint -- markers and attribution still render, which makes it
// look like a blank map rather than an error. The stock style declares no SDK
// floor. Point this back at the custom style once mapbox-gl is on 3.x.
export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12'

export { fetchMeetings, fetchDevelopments, Image, useArchivedSource }
