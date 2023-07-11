const fs = require('fs')
const path = require('path')
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.cli()
  ),
  transports: [
    new winston.transports.Console()
  ]
})

const writeToFileForce = (path, data) => {
  logger.info(`writeToFile: ${path}`)
  const directory = path.split('/').slice(0, -1).join('/')
  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {};
    fs.open(path, 'r', function (err, fd) {
      if (err) {
        fs.appendFile(path, '', function (err) {
          if (err) console.error(err)
          fs.writeFileSync(path, data)
        })
      } else {
        fs.writeFileSync(path, data)
      }
    })
  })
}

exports.writeToFileForce = writeToFileForce

exports.writeJsonToFileForce = (path, data) => {
  data = JSON.stringify(data, null, 2)
  writeToFileForce(path, data)
}

exports.normalize = (str) => {
  return str.replace(/\s+/g, ' ').trim()
}

exports.transformLogs = (diff = [], timestamp) => {
  return diff.map(dif => {
    return {
      ...dif,
      projectId: dif.path ? dif.path[0] : null,
      timestamp
    }
  })
}

exports.mergeObject = (a, b) => {
  return Object.assign({}, a, b)
}

exports.absolutePath = (p) => {
  return path.join(__dirname, '../..', p)
}

exports.generateValidDatekey = () => {
  const t = new Date()
  const y = t.getFullYear()
  let m = t.getMonth() + 1
  let d = t.getDate()
  let h = t.getHours()
  m = m < 10 ? `0${m}` : m
  d = d < 10 ? `0${d}` : d
  h = h < 10 ? `0${h}` : h
  const fullDate = String(`${y}${m}${d}${h}0000`)
  return fullDate
}

exports.logger = logger
exports.parseHtml = require('./parseHtml')
