const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const rdiff = require('recursive-diff')
const { writeJsonToFileForce, normalize, transformLogs, mergeObject } = require('./utils')

const generateLogs = ({oldData={}, newData, timeStamp}) => {
  return transformLogs(rdiff.getDiff(oldData, newData, true), timeStamp)
}

async function worker ({
  siteUrl,
  snapshotPath,
  logsPath,
  timeStamp,
  enableLogs
}) {
  console.log('worker started', { siteUrl, snapshotPath, logsPath, timeStamp, enableLogs })

  const existingSnapshot = require(snapshotPath)
  const existingLogs = require(logsPath)
  
  return new Promise((resolve, reject) => {
    axios.get(siteUrl)
      .then(async res => {
        // const html = fs.readFileSync(path.join(__dirname, '..','docs/index.html'))
        const html = res.data
        const data = await snapshot(html)
        const attachCreatedAt = (data) => {
          Object.keys(data).forEach(k => {
            const d = data[k]
            d.createdAt = existingSnapshot[d.id]?.createdAt ? existingSnapshot[d.id]?.createdAt : timeStamp
          })
          return data;
        }
        writeJsonToFileForce(snapshotPath, mergeObject(existingSnapshot, attachCreatedAt(data)))

        const logs = generateLogs({oldData: existingSnapshot, newData: data, timeStamp})
        if (enableLogs && logs.length > 0) writeJsonToFileForce(logsPath, [...existingLogs, ...logs])

        console.log('worker finished', { siteUrl, snapshotPath, logsPath, timeStamp, enableLogs })
        return resolve()
      })
      .catch(reject)
  })
}

const snapshot = async (html) => {
  return new Promise((resolve, reject) => {
  const $ = cheerio.load(html)
  const projectIDs = []

  const detailsFns = {
    Applicant: (el) => {
      const i = $(el).find('.table-right').html().trim().split('<br>').map(normalize)
      let r = {}
      if (i.length === 3) {
        r = {
          name: i[0],
          address: i[1],
          phone: i[2]
        }
      } else {
        if (i[1].length > 15) {
        // is address
          r = {
            name: i[0],
            address: i[1],
            phone: 'n/a'
          }
        } else {
          r = {
            name: i[0],
            address: 'n/a',
            phone: i[1]
          }
        }
      }
      return r
    },
    'Project Planner': (el) => {
      const i = $(el).find('.table-right').html().trim().split('<br>').map(normalize)
      return {
        name: i[0],
        phone: i[1],
        email: normalize($(el).find('.table-right').find('a').text())
      }
    }
  }

  $('.modal.fade').each((i, el) => {
    projectIDs.push(el.attribs.id)
  })

  function parseGeo () {
    const dict = {}
    $('script[type="text/javascript"]').each((index, element) => {
      const scriptContent = $(element).html()
      const latMatch = scriptContent.match(/var lat = (.*?);/)
      const lonMatch = scriptContent.match(/var lon = (.*?);/)
      const postidMatch = scriptContent.match(/var postid =(.*?);/)
      const iconNameMatch = scriptContent.match(/var iconName = "(.*?)";/)

      if (latMatch && lonMatch && postidMatch) {
        const lat = parseFloat(latMatch[1])
        const lon = parseFloat(lonMatch[1])
        const postid = parseInt(postidMatch[1])
        const iconName = iconNameMatch ? iconNameMatch[1] : 'dot'

        const item = {
          lat,
          lon,
          iconName
        }
        dict[`projectDetail${postid}`] = item
      }
    })

    return dict
  }

  const geoDict = parseGeo()
  const result = {}
  projectIDs.forEach((id) => {
    const el = $(`#${id}`)[0];
      const d = {}
      d.id = id
      d.title = $(el).find('#myModalLabel').text()
      d.details = {}
      $(el).find('table').find('tr').each((i, el) => {
        const key = normalize($(el).find('.table-left').find('strong').text())
        const val = normalize($(el).find('.table-right').text())
        d.details[key] = val
        if (detailsFns[key] !== undefined) {
          d.details[key] = detailsFns[key](el)
        }
      })

      function findSessionByTitle (title) {
        return $(el).find('h4.dublin-green').filter((i, el) => $(el).text() === title)[0]
      }

      d.location = normalize(findSessionByTitle('Address')?.nextSibling.nodeValue)
      const docs = $(el).find('h4.dublin-green')[3]
      function transformCityDocsUrl (url) {
        return url
          .replace('http://citydocs.ci.dublin.ca.us/', 'https://citydocs.dublin.ca.gov/')
          .replace('https://dublin-development.icitywork.com/', '')
          .replace('wp-content/', 'https://dublin-development.icitywork.com/wp-content/')
      }
      function transformImagesUrl (url) {
        return url
          .replace('https://dublin-development.icitywork.com/', '')
          .replace('wp-content/', 'https://dublin-development.icitywork.com/wp-content/')
      }
      function traverseDocsSiblings (el, acc = []) {
        if ($(el).next().find('a').attr('href') !== undefined) {
          return traverseDocsSiblings($(el).next(), [...acc, {
            name: normalize($(el).next().text()),
            url: transformCityDocsUrl($(el).next().find('a').attr('href'))
          }])
        } else {
          return acc
        }
      }
      d.docs = traverseDocsSiblings(docs.nextSibling)
      d.status = $(findSessionByTitle('Status')).next().attr('alt')
      d.description = normalize($(findSessionByTitle('Project Description')).next().text())
      const images = findSessionByTitle('Project Images').nextSibling
      d.images = $(images).next().find('li').map((i, el) => ({
        original: transformImagesUrl($(el).find('a').attr('href')),
        thumbnail: transformImagesUrl($(el).find('img').attr('src'))
      })).get()
      d.geolocation = {
        lat: null,
        lon: null,
        iconName: 'dot',
        title: d.title,
        ...geoDict[d.id]
      }
      result[d.id] = d
  })
  return resolve(result)
  })
}

if (require.main === module) {
  worker(
    {
      siteUrl: 'https://dublin-development.icitywork.com',
      snapshotPath: path.join(__dirname, '../api/', 'developments/snapshot.json'),
      logsPath: path.join(__dirname, '../api/', 'developments/logs.json'),
      timeStamp: Date.now(),
      enableLogs: process.env.ENABLE_LOGS === 'true'
    }

  )
}

exports.worker = worker
exports.snapshot = snapshot
exports.generateLogs = generateLogs
