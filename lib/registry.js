/* eslint-disable no-multi-spaces */
const os      = require('os')
const util    = require('util')
const mkdirp  = util.promisify(require('mkdirp'))
const request = require('request-promise-native')
const fs      = require('./fs-as-promise')
/* eslint-enable no-multi-spaces */

/**
 * Holds the entire registry in RAM.
 */
var REGISTRY = null

/**
 * Holds the full path for the cache directory.
 *
 * @see XDG Base Directory Specification https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
 */
const DSAFIO_CACHE_HOME = (process.env.DSAFIO_CACHE_HOME || process.env.XDG_CACHE_HOME || `${os.homedir()}/.cache`).concat('/dsafio')

const DSAFIO_CACHE_FILE = process.env.DSAFIO_CACHE_FILE || `${DSAFIO_CACHE_HOME}/registry.json`

const API_BASE_URL = 'https://api.github.com'

function get (keys) {
  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    return Promise.reject(new Error('registry.get() accepts an array of configuration keys'))
  }

  const chain = Promise.resolve()

  return REGISTRY
    ? Promise.resolve(Object.assign({}, REGISTRY))
    : chain.then(loadFromDisk)
        .catch(error => {
          if (error.code === 'ENOENT') {
            return loadFromApi()
          }

          throw error
        })
        .then(cacheOnMemory)
        .then(cacheOnDisk)
}

function loadFromDisk () {
  return fs.readFile(DSAFIO_CACHE_FILE, 'utf8')
    .then(JSON.parse)
}

function loadFromApi () {
  return request.get(`${API_BASE_URL}/repos/dsafio/challenges/contents/registry.json`, {
    headers: { 'User-Agent': 'dsafio/dsafio' }
  })
    .then(JSON.parse)
    .then(payload => payload.content)
    .then(raw => Buffer.from(raw, 'base64').toString())
    .then(JSON.parse)
}

function cacheOnMemory (registry) {
  return Promise.resolve(REGISTRY = Object.assign({}, registry))
}

function cacheOnDisk (registry) {
  return mkdirp(DSAFIO_CACHE_HOME)
    .then(() => fs.writeFile(DSAFIO_CACHE_FILE, JSON.stringify(registry), 'utf8'))
    .then(() => registry)
}

function update () {
  return loadFromApi()
    .then(cacheOnMemory)
    .then(cacheOnDisk)
}

module.exports = { get, update }
