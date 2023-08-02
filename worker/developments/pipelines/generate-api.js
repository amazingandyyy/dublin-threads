const _ = require('lodash')
const { absolutePath, writeJsonToFileForce } = require('../../utils')
const { generateLogs } = require('../utils/generator')

const apiVersion = 'v2'
const apiPath = `docs/api/${apiVersion}`

const getDateKeys = async () => {
  return require(absolutePath('docs/archive-developments/datekeys.json'))
}

const getAllProjectIds = async (datekeys) => {
  const result = []
  return new Promise((resolve, reject) => {
    datekeys.forEach((datekey) => {
      const snapshot = require(absolutePath(`docs/archive-developments/${datekey}/dublin-development.icitywork.com/snapshot.json`))
      result.push(...Object.keys(snapshot))
    })
    return resolve([...new Set(result)].sort((a, b) => {
      a = Number(a.replace(/projectdetail/ig, ''))
      b = Number(b.replace(/projectdetail/ig, ''))
      return a - b
    }))
  })
}

async function generateProjectIds (datekeys, opts) {
  const allProjectIds = await getAllProjectIds(datekeys)
  if (opts.metadata) writeJsonToFileForce(absolutePath(`${apiPath}/developments/metadata/projectIds.json`), allProjectIds)
  return allProjectIds
}

async function generateLogsByProjectId (allLogs, ids) {
  ids.forEach((projectId) => {
    const projectdetail = _.filter(allLogs, { projectId }).sort((a, b) => a.timestamp - b.timestamp) // from oldest to newest
    writeJsonToFileForce(absolutePath(`${apiPath}/developments/logs/${projectId}.json`), projectdetail)
  })
}

async function generateSnapshotByProjectId (datekeys) {
  datekeys.forEach((datekey) => {
    const snapshot = require(absolutePath(`docs/archive-developments/${datekey}/dublin-development.icitywork.com/snapshot.json`))
    writeJsonToFileForce(absolutePath(`${apiPath}/developments/snapshots/${datekey}.json`), snapshot)
    const latestDatekey = _.last(require(absolutePath('docs/archive-developments/datekeys.json')))
    if (datekey === latestDatekey) writeJsonToFileForce(absolutePath(`${apiPath}/developments/snapshots/latest.json`), snapshot)
  })
}

const transformedDatekeyToTimestamp = (datekey) => {
  const year = parseInt(datekey.slice(0, 4))
  const month = parseInt(datekey.slice(4, 6)) - 1
  const day = parseInt(datekey.slice(6, 8))
  const hour = parseInt(datekey.slice(8, 10))
  const minute = parseInt(datekey.slice(10, 12))
  const second = parseInt(datekey.slice(12, 14))

  return new Date(year, month, day, hour, minute, second).getTime()
}

async function generateAllLogs (datekeys) {
  let allLogs = []
  return new Promise((resolve, reject) => {
    datekeys.forEach((datekey, i) => {
      const previousSnapshot = datekeys[i - 1] ? require(absolutePath(`docs/archive-developments/${datekeys[i - 1]}/dublin-development.icitywork.com/snapshot.json`)) : {}
      const currentSnapshot = require(absolutePath(`docs/archive-developments/${datekeys[i]}/dublin-development.icitywork.com/snapshot.json`))
      const timestamp = transformedDatekeyToTimestamp(datekey)
      const log = generateLogs({ oldData: previousSnapshot, newData: currentSnapshot, timestamp: String(timestamp) })
      allLogs.push(...log)
    })
    allLogs = allLogs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    writeJsonToFileForce(absolutePath(`${apiPath}/developments/logs/global.json`), allLogs)
    return resolve(allLogs)
  })
}

async function main () {
  const datekeys = await getDateKeys()
  const allProjectIds = await generateProjectIds(datekeys, { metadata: true })
  const allLogs = await generateAllLogs(datekeys)
  await generateLogsByProjectId(allLogs, allProjectIds)
  await generateSnapshotByProjectId(datekeys, allProjectIds)
}

if (require.main === module) {
  main()
}

module.exports = main
