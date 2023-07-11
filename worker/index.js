const axios = require('axios')
const fs = require('fs')
const rdiff = require('recursive-diff')
const { parseHtml, writeToFileForce, generateValidDatekey, writeJsonToFileForce, normalize, transformLogs, mergeObject, absolutePath } = require('./utils')

const generateLogs = ({oldData={}, newData, timeStamp}) => {
  return transformLogs(rdiff.getDiff(oldData, newData, true), timeStamp)
}

async function worker ({
  source,
  snapshotPath,
  allPath="",
  logsPath,
  timeStamp,
  enableAll,
  enableLogs
}) {
  console.log('worker started', { source, snapshotPath, allPath, logsPath, timeStamp, enableAll, enableLogs })

  const existingSnapshot = require(snapshotPath)
  const existingLogs = require(logsPath)
  
  return new Promise(async (resolve, reject) => {
    const isRemote = source.includes('https');
    let html = ""
    html = isRemote ? await axios.get(source) : fs.readFileSync(source)
    html = isRemote ? html.data : html
    const jsonData = await parseHtml(html)
    const fullDate = new Date(Number(timeStamp)).toISOString().split('T')[0]
    const unix = new Date(fullDate).getTime();
    const fullDatePath = generateValidDatekey(new Date())
    
    // store records in archive
    writeJsonToFileForce(absolutePath(`docs/archive/${fullDatePath}/dublin-development.icitywork.com/snapshot.json`), jsonData)
    writeToFileForce(absolutePath(`docs/archive/${fullDatePath}/dublin-development.icitywork.com/index.html`), html)
    const currentDateKeys = require(absolutePath('docs/archive/datekeys.json'))
    writeJsonToFileForce(absolutePath(`docs/archive/datekeys.json`), {...currentDateKeys, [fullDatePath]: String(unix)})
    //////////////////////////

    writeJsonToFileForce(absolutePath('api/developments/latest.json'), jsonData)
    
    const logs = generateLogs({oldData: existingSnapshot, newData: jsonData, timeStamp})
    if (enableLogs && logs.length > 0) {
      writeJsonToFileForce(logsPath, [...existingLogs, ...logs])
    }
    if (enableAll) {
      const existingAll = require(allPath)
      console.log(existingAll, jsonData)
      writeJsonToFileForce(absolutePath('api/developments/all.json'), mergeObject(existingAll, jsonData))
    }

    console.log('worker finished', { source, snapshotPath, allPath, logsPath, timeStamp, enableAll, enableLogs })
    return resolve()
  })
}

if (require.main === module) {
  worker(
    {
      source: 'https://dublin-development.icitywork.com',
      snapshotPath: absolutePath('api/developments/latest.json'),
      logsPath: absolutePath('api/developments/logs.json'),
      allPath: absolutePath('api/developments/all.json'),
      timeStamp: Date.now(),
      enableAll: process.env.ENABLE_ALL === 'true',
      enableLogs: process.env.ENABLE_LOGS === 'true'
    }
  )
}

exports.worker = worker
exports.parseHtml = parseHtml
exports.generateLogs = generateLogs
