const worker = require('./index')
const path = require('path')

const times = require(path.join(__dirname, '../docs', 'archive/list2unix.json'))
const asyncTimes = Object.keys(times).map((k) => {
  try {
    return worker.bind(null, {
      siteUrl: 'https://raw.githubusercontent.com/amazingandyyy/dublin-ca/main/docs/archive/' + k + '/dublin-development.icitywork.com/index.html',
      snapshotPath: path.join(__dirname, '../docs/', 'archive/' + k + '/dublin-development.icitywork.com/snapshot.json'),
      logsPath: path.join(__dirname, '../docs/', 'archive/logs.json'),
      timeStamp: times[k],
      uid: k,
      enableLogs: true
    })
  } catch (err) {
    console.error(err)
  }
})

async function main () {
  for (const t of asyncTimes) {
    await t()
  }
}

main()
