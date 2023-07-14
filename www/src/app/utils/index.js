const rootUrl = 'https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs'
const developmentApiUrl = '/api/v2/developments/'

const fetchApi = (path) => {
  return fetch(`${rootUrl}${path}`)
}

const fetchDevelopments = (path) => {
  return fetchApi(`${developmentApiUrl}${path}`)
}

export { fetchDevelopments }
