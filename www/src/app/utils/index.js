import Image from './image'
const rootUrl = 'https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs'
const developmentApiUrl = '/api/v2/developments/'

const fetchApi = (path) => {
  return fetch(`${rootUrl}${path}`)
}
const fetchDevelopments = (path) => {
  return fetchApi(`${developmentApiUrl}${path}`)
}

function timeSince (date) {
  const seconds = Math.floor((new Date() - date) / 1000)
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

export { fetchDevelopments, timeSince, Image }
