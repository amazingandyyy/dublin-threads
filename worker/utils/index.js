const fs = require('fs')

const writeToFileForce = (path, data) => {
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
}

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
      projectId: dif.path? dif.path[0]: null,
      timestamp
    }
  })
}

exports.mergeObject = (a, b) => {
  return Object.assign({}, a, b)
}
