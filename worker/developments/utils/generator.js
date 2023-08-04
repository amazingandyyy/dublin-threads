const { globSync } = require('glob')
const rdiff = require('recursive-diff')

const { transformLogs, writeToFileForce, writeJsonToFileForce, absolutePath } = require('../../utils')
const parseHtml = require('./parseHtml')

const generateJson = async (datekey, html) => {
  const jsonData = await parseHtml(html)
  writeJsonToFileForce(absolutePath(`docs/archive-developments/${datekey}/dublin-development.icitywork.com/snapshot.json`), jsonData)
}

const generateDateKeys = async () => {
  let datakeys = await globSync(absolutePath('docs/archive-developments/*'))
  datakeys = datakeys.filter(k => !k.includes('json') && !k.includes('txt'))
    .map(k => k.replace(absolutePath('docs/archive-developments/'), ''))
    .sort((a, b) => a - b)
  const datekeysLatest = datakeys[datakeys.length - 1]
  writeJsonToFileForce(absolutePath('docs/archive-developments/datekeys.json'), datakeys)
  writeToFileForce(absolutePath('docs/archive-developments/datekeys-latest.txt'), datekeysLatest)
}

const generateLogs = ({ oldData = {}, newData, timestamp }) => {
  return transformLogs(rdiff.getDiff(oldData, newData, true), timestamp, 'developments')
}

exports.generateJson = generateJson
exports.generateDateKeys = generateDateKeys
exports.generateLogs = generateLogs
