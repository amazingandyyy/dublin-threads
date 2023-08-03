const playwright = require('playwright')
const { writeToFileForce, absolutePath } = require('../../utils')

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
    console.log('done loading')
    const frames = await page.frames()
    for (const x of frames) { // Getting all iFrames
      try {
        const frameContent = await x.content()
        if (frameContent.includes('GranicusMainViewContent')) {
          writeToFileForce(absolutePath('docs/archive-meetings/meetings.html'), frameContent)
        }
      } catch (error) {
        console.log(error)
      }
    }
    // const title = await page.locator('#CollapsiblePanel1 .CollapsiblePanelTab').allInnerTexts()
  } catch (e) {
    console.error(e)
  }
}

main()
