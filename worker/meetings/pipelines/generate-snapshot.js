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
    for (let i = 0; i < frames.length; i++) { // Getting all iFrames
      const x = frames[i]
      try {
        const frameContent = await x.content()
        if (frameContent.includes('GranicusMainViewContent')) {
          writeToFileForce(absolutePath('docs/archive-meetings/meetings.html'), frameContent)
          generateJson(frameContent)
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
