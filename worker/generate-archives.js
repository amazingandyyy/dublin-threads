const { worker, generateLogs } = require('./index')
const path = require('path')
const { writeJsonToFileForce } = require('./utils')

const times = require(path.join(__dirname, '../docs', 'archive/list2unix.json'))

const asyncTimes = Object.keys(times).map((k) => {
  try {
    return worker.bind(null, {
      siteUrl: `https://raw.githubusercontent.com/amazingandyyy/dublin-ca/main/docs/archive/${k}/dublin-development.icitywork.com/index.html`,
      snapshotPath: path.join(__dirname, '../docs/', `archive/${k}/dublin-development.icitywork.com/snapshot.json`),
      logsPath: path.join(__dirname, '../docs/', 'archive/logs.json'),
      timeStamp: times[k],
      archiveuUid: k,
      enableLogs: false
    })
  } catch (err) {
    console.error(err)
  }
})

const generateArchiveLogs = () => {
  const reverseDict = {}
  Object.keys(times).map((k, index) => {
    reverseDict[index] = k
  })
  // console.log(reverseDict)
  const result = []
  for (let counter=0; counter<Object.keys(reverseDict).length; counter++) {
    let current = reverseDict[counter]
    let previous = reverseDict[counter-1]
    let currentPath = path.join(__dirname, '../docs/', `archive/${current}/dublin-development.icitywork.com/snapshot.json`)
    let previousPath = path.join(__dirname, '../docs/', `archive/${previous}/dublin-development.icitywork.com/snapshot.json`)
    let currentData = require(currentPath)
    let previousData = (counter === 0) ? {} : require(previousPath)

    if(previousData && currentData) {
      let logs = generateLogs({oldData: previousData, newData: currentData, timeStamp: times[current]})
      result.push(...logs)
    }
  }
  writeJsonToFileForce(path.join(__dirname, '../docs/', 'archive/logs.json'), result)
}

async function main () {
  for (const t of asyncTimes) {
    await t()
  }
  generateArchiveLogs()
}

main()
