/* eslint-disable no-multi-spaces */
const os      = require('os')
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
        .then(registry => {
          // stores registry in RAM before returning to the promise chain
          REGISTRY = Object.assign({}, registry)
          return REGISTRY
        })
        .then(() => {
          const json = JSON.stringify(REGISTRY)
          fs.writeFile(DSAFIO_CACHE_FILE, json, 'utf8')
        })
        .then(() => REGISTRY)
}

function loadFromDisk () {
  return fs.readFile(DSAFIO_CACHE_FILE, 'utf8')
    .then(JSON.parse)
}

function loadFromApi () {
  return request(`${API_BASE_URL}/repos/dsafio/challenges/contents/registry.json`, {
    headers: { 'User-Agent': 'dsafio/dsafio' }
  })
    .then(JSON.parse)
    .then(payload => payload.content)
    .then(raw => Buffer.from(raw, 'base64').toString())
    .then(JSON.parse)
}

module.exports = { get }
