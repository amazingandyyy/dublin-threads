const playwright = require('playwright')
const { writeToFileForce, absolutePath } = require('../../utils')
const generateJson = require('./generate-json')

// const cheerio = require("cheerio");
// const axios = require('axios')
const target = 'https://dublin.ca.gov/1604/Meetings-Agendas-Minutes-Video-on-Demand'

async function main () {
  try {
    const browser = await playwright.chromium.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(target, {
      waitUntil: 'networkidle'
    })
    const frames = await page.frames()
    for (const x of frames) { // Getting all iFrames
      try {
        let html = await x.content()
        if (html.includes('GranicusMainViewContent')) {
          html = html.replace(/"applicationTime":\d+,/ig, '')
          writeToFileForce(absolutePath('docs/archive-meetings/meetings.html'), html)
          generateJson(html)
          break
        }else{
          console.log('skipped iframe')
        }
      } catch (error) {
        console.log(error)
      }
    }
    await browser.close();
  } catch (e) {
    console.error(e)
  }
}

main()
