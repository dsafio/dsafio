/* eslint-disable no-multi-spaces */
const fs   = require('fs')
const util = require('util')
/* eslint-enable no-multi-spaces */

module.exports = {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile)
}
