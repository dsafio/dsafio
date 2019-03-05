/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const fs = require('fs')
const util = require('util')

module.exports = {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile)
}
