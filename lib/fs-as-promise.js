const fs = require('fs')
const util = require('util')

module.exports = {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile)
}
