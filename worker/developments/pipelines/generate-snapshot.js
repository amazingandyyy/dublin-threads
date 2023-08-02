const axios = require('axios')
const fs = require('fs')
const { writeToFileForce, generateValidDatekey, absolutePath, logger } = require('../../utils')
const { generateDateKeys } = require('../utils/generator')

const target = 'https://dublin-development.icitywork.com/'

async function main () {
  const datekey = generateValidDatekey(new Date())
  const updated = await generateHtml(datekey)
  if (updated) await generateDateKeys()
}

const generateHtml = async (datekey) => {
  let html = await axios.get(target)
  html = html.data.replace(/\?wordfence_lh=1&hid=.*/i, '')
  const previousDatekey = fs.readFileSync(absolutePath('docs/archive-developments/datekeys-latest.txt'), 'utf8')
  const previousHtml = fs.readFileSync(absolutePath(`docs/archive-developments/${previousDatekey}/dublin-development.icitywork.com/index.html`), 'utf8')
  if (previousHtml === html) {
    logger.info('No page changes detected, skipping snapshot')
    return false
  }
  const p = absolutePath(`docs/archive-developments/${datekey}/dublin-development.icitywork.com/index.html`)
  writeToFileForce(p, html)
  return true
}

main()
