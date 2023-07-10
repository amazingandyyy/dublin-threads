const path = require('path')
const _ = require('lodash')

const data = require(path.join(__dirname, '../docs/', 'archive/logs.json'))

const projectdetail = _.filter(data, {projectId: "projectdetail63"})

const result = projectdetail.map(i=>{
  const d = new Date(Math.floor(i.timestamp))
  i.timestamp = d.toISOString()
  return i
})

console.log(result)
