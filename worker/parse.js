const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const { writeToFileForce, writeJsonToFileForce, normalize, absolutePath } = require('./utils')

const replaceProjectDetail = (data) => {
  return String(data).replace(/projectDetail/ig, 'projectdetail')
}

async function parse ({
  source,
  timeStamp
}) {
  console.log('parse started', { source, timeStamp })
  return new Promise(async (resolve, reject) => {
    const isRemote = source.includes('https');
    let html = ""
    html = isRemote ? await axios.get(source) : fs.readFileSync(source)
    html = isRemote ? html.data : html
    const jsonData = await parseHtml(html)
    const fullDate = new Date(Number(timeStamp)).toISOString().split('T')[0]
    const unix = new Date(fullDate).getTime();
    const fullDatePath = generateValidDatekey(new Date())
    
    // store HTML and snapshot JSON in archive
    writeJsonToFileForce(absolutePath(`docs/archive/${fullDatePath}/dublin-development.icitywork.com/snapshot.json`), jsonData)
    
    // push key to datekeys.json
    const currentDateKeys = require(absolutePath('docs/archive/datekeys.json'))
    writeJsonToFileForce(absolutePath(`docs/archive/datekeys.json`), {...currentDateKeys, [fullDatePath]: String(unix)})
    //////////////////////////
    console.log('parse finished', { source, timeStamp })
    return resolve()
  })
}

exports.parse = parse
