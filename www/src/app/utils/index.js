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

function timeSince (date) {
  let seconds = Math.floor((new Date() - date) / 1000)
  if(seconds < 0) {
    seconds = Math.floor((date - new Date()) / 1000)
  }
  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}

export { fetchMeetings, fetchDevelopments, timeSince, Image, useArchivedSource }
