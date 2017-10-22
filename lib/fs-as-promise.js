/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/* eslint-disable no-multi-spaces */
const fs   = require('fs')
const util = require('util')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/lib/fs-as-promise')
debug('lib/fs-as-promise running')

module.exports = {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile)
}
