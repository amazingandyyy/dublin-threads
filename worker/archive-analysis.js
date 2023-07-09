const path = require('path')
const _ = require('lodash')

const data = require(path.join(__dirname, '../docs/', 'archive/logs.json'))

const projectdetail37 = _.filter(data, {projectId: "projectdetail37"})

console.log(projectdetail37)
