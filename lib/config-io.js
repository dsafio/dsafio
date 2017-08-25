const fs   = require('fs')
const os   = require('os')
const util = require('util')

const debug = require('debug')('dsafio-config-io')

const DSAFIO_CONFIG_FILE = process.env.DSAFIO_CONFIG_FILE || `${os.homedir()}/.dsafiorc`

const readFile  = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function read () {
  debug('reading user configuration')
  return readFile(DSAFIO_CONFIG_FILE, 'utf8')
}

function write (contents) {
  debug('writing user configuration')
  return writeFile(DSAFIO_CONFIG_FILE, contents, 'utf8')
}

module.exports = { read, write, CONFIG_FILE: DSAFIO_CONFIG_FILE }
