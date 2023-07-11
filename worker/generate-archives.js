const { worker, generateLogs } = require('./index')
const { writeJsonToFileForce, absolutePath } = require('./utils')

const times = require(absolutePath('docs/archive/datekeys.json'))

const asyncTimes = Object.keys(times).map((k) => {
  try {
    return worker.bind(null, {
      source: absolutePath(`docs/archive/${k}/dublin-development.icitywork.com/index.html`),
      timeStamp: times[k],
    })
  } catch (err) {
    console.error(err)
  }
})

const generateArchiveLogs = () => {
  console.log('generateArchiveLogs started')
  const reverseDict = {}
  Object.keys(times).map((k, index) => {
    reverseDict[index] = k
  })
  // console.log(reverseDict)
  const result = []
  for (let counter=0; counter<Object.keys(reverseDict).length; counter++) {
    let current = reverseDict[counter]
    let previous = reverseDict[counter-1]
    let currentPath = absolutePath(`docs/archive/${current}/dublin-development.icitywork.com/snapshot.json`)
    let previousPath = absolutePath(`docs/archive/${previous}/dublin-development.icitywork.com/snapshot.json`)
    let currentData = require(currentPath)
    let previousData = (counter === 0) ? {} : require(previousPath)

    if(previousData && currentData) {
      let logs = generateLogs({oldData: previousData, newData: currentData, timeStamp: times[current]})
      result.push(...logs)
    }
  }
  writeJsonToFileForce(absolutePath(`docs/archive/logs.json`), result)
  console.log('generateArchiveLogs finished')
}

async function main () {
  for (const t of asyncTimes) {
    await t()
  }
  generateArchiveLogs()
}

main()
