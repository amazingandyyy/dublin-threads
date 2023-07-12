const fs = require('fs')
const { absolutePath } = require('../utils')
const { generateJson } = require('../utils/generator')

async function main() {
  const datekeys = require(absolutePath('docs/archive/datekeys.json'))
  const promises = datekeys.map(async datekey => {
    const html = fs.readFileSync(
      absolutePath(`docs/archive/${datekey}/dublin-development.icitywork.com/index.html`) ,'utf8')
    return await generateJson(datekey, String(html))
  })
  await Promise.all(promises)
}

main()
