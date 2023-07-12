const axios = require('axios')

const { writeToFileForce, generateValidDatekey, absolutePath } = require('../utils');
const { generateDateKeys } = require('../utils/generator');

const target = 'https://dublin-development.icitywork.com/'

async function main() {
  const datekey = generateValidDatekey(new Date())
  await generateHtml(datekey)
  await generateDateKeys()
}

const generateHtml = async (datekey) => {
  let html = await axios.get(target)
  html = html.data.replace(/\?wordfence_lh=1&hid=.*/i, '')
  const p = absolutePath(`docs/archive/${datekey}/dublin-development.icitywork.com/index.html`);
  writeToFileForce(p, html)
  return html
}

main()
