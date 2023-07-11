const axios = require('axios')
const {globSync} = require('glob');

const { parseHtml, writeToFileForce, writeJsonToFileForce, generateValidDatekey, absolutePath } = require('./utils');

const source = 'https://dublin-development.icitywork.com/'

async function main() {
  const datekey = generateValidDatekey(new Date())
  const html = await generateHtml(datekey)
  await generateJson(datekey, html)
  await generateDateKeys()
}

const generateJson = async (datekey, html) => {
  const jsonData = await parseHtml(html)
  writeJsonToFileForce(absolutePath(`docs/archive/${datekey}/dublin-development.icitywork.com/snapshot.json`), jsonData) 
}

const generateHtml = async (datekey) => {
  let html = await axios.get(source)
  html = html.data.replace(/\?wordfence_lh=1&hid=.*/i, '')
  const p = absolutePath(`docs/archive/${datekey}/dublin-development.icitywork.com/index.html`);
  writeToFileForce(p, html)
  return html
}

const generateDateKeys = async () => {
  let datakeys = await globSync(absolutePath('docs/archive/*'));
  datakeys = datakeys.filter(k=>!k.includes('json') && !k.includes('txt'))
                     .map(k=>k.replace(absolutePath('docs/archive/'), ''))
                     .sort((a, b)=> a-b)
  datekeysLatest = datakeys[datakeys.length-1]
  writeJsonToFileForce(absolutePath('docs/archive/datekeys.json'), datakeys)
  writeToFileForce(absolutePath('docs/archive/datekeys-latest.txt'), datekeysLatest)
}

main()
