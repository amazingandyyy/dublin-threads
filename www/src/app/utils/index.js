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

  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds} seconds ago`
  if (minutes === 1) return 'a minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours === 1) return 'an hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  
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

export { fetchMeetings, fetchDevelopments, Image, useArchivedSource }
