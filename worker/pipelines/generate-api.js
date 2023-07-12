const _ = require('lodash')
const { absolutePath, writeJsonToFileForce } = require('../utils')

const getAllProjectIds = async () => {
  let result = []
  return new Promise((resolve, reject) => {
    const times = require(absolutePath('docs/archive/datekeys.json'))
    Object.keys(times).forEach((k) => {
      const snapshot = require(absolutePath(`docs/archive/${k}/dublin-development.icitywork.com/snapshot.json`))
      result.push(...Object.keys(snapshot))
    })
    return resolve([...new Set(result)].sort((a, b)=>{
      a = Number(a.replace(/projectdetail/ig, ''))
      b = Number(b.replace(/projectdetail/ig, ''))
      return a-b
    }))
  })
}

async function generateProjectIds() {
  const allProjectIds = await getAllProjectIds()
  writeJsonToFileForce(absolutePath(`api/v2/developments/metadata/projectIds.json`), allProjectIds)
  return allProjectIds
}

async function generateLogsByProjectId(ids = []) {
  const globalLogs = require(absolutePath(`docs/archive/logs.json`))
  ids.forEach((projectId) => {
    const projectdetail = _.filter(globalLogs, {projectId}).sort((a, b) => a.timestamp - b.timestamp) // from oldest to newest
    writeJsonToFileForce(absolutePath(`api/v2/developments/logs/${projectId}.json`), projectdetail)
  })
}

async function main () {
  const allProjectIds = await generateProjectIds()
  await generateLogsByProjectId(allProjectIds)
}

if (require.main === module) {
  main()
}

module.exports = main
