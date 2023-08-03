const fs = require('fs')
const { absolutePath, writeJsonToFileForce } = require('../../utils')
const cheerio = require('cheerio')

async function main () {
  const html = fs.readFileSync(absolutePath('docs/archive-meetings/meetings.html'))
  const $ = cheerio.load(html)
  const events = []

  function getElementByIndex (parent, selector, index = 0) {
    const data = []
    $(parent).find(selector).each((i, el) => data.push(el))
    return {
      length: data.length,
      el: $(data[index]),
      inner: data[index],
      list: data
    }
  }
  function normalize (str = '') {
    return str?.replace(/\n/ig, '').trim()
  }
  function convertDateStringToDate (inputDate) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ]

    // Split the input string into month, day, and year parts
    inputDate = inputDate.split('').map(i => {
      if (/\s/.test(i)) return '@'
      return i
    }).join('')
    const parts = inputDate.split('@')
    if (parts.length === 3) {
      const month = months.indexOf(parts[0]) + 1
      const day = parseInt(parts[1].replace(',', ''), 10)
      const year = parseInt(parts[2], 10)

      // Format the date in "MM-DD-YYYY" format
      return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`
    } else {
      return null
    }
  }
  function normalizeDate (str) {
    return convertDateStringToDate(normalize(str))
  }
  function normalizeUrl (str) {
    if (str) {
      if (str.includes('https')) return str
      if (str.includes('//')) return 'https:' + str
      return 'https://' + str
    } else {
      return ''
    }
  }
  function normalizeVideo (str) {
    str = str?.replace('window.open(\'//', '')
    str = str?.replace('\',\'player\',\'toolbar=no,directories=no,status=yes,scrollbars=yes,resizable=yes,menubar=no\')', '')
    return normalizeUrl(str)
  }

  // every CollapsiblePanel is every entity
  $('.CollapsiblePanel').each((i, year) => {
    const entity = $(year).find('.CollapsiblePanelTab').text()

    const yearsCounter = getElementByIndex(year, '.TabbedPanelsContentGroup .TabbedPanelsContent').list
    for (let y = 0; y < yearsCounter.length; y++) {
      // every year 2020 2021 2022 2023
      const yearElement = yearsCounter[y]
      const meetingRows = getElementByIndex(yearElement, '.listingRow').list
      for (let r = 0; r < meetingRows.length; r++) {
        const meetingRow = meetingRows[r]
        const name = normalize(getElementByIndex(meetingRow, '.listingRow .listItem', 0).el.text())
        const date = normalizeDate(getElementByIndex(meetingRow, '.listingRow .listItem', 1).el.text())
        const agenda = normalizeUrl(getElementByIndex(meetingRow, '.listingRow .listItem', 2).el.find('a').attr('href'))
        const minutes = normalizeUrl(getElementByIndex(meetingRow, '.listingRow .listItem', 3).el.find('a').attr('href'))
        const video = normalizeVideo(getElementByIndex(meetingRow, '.listingRow .listItem', 4).el.find('a').attr('onclick'))
        const agendaPacket = normalizeUrl(getElementByIndex(meetingRow, '.listingRow .listItem', 5).el.find('a').attr('href'))
        const cancelled = /.*cancel.*/ig.test(name)
        const meeting = {
          organizor: entity,
          cancelled,
          name,
          date,
          agenda,
          minutes,
          video,
          agendaPacket
        }
        events.push(meeting)
      }
    }
  })
  console.log(events.length + ' events')
  writeJsonToFileForce(absolutePath('docs/archive-meetings/meetings.json'), events)
  writeJsonToFileForce(absolutePath('docs/api/v2/meetings/all.json'), events)
}

try {
  main()
} catch (e) {
  console.error(e)
}
