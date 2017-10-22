/* eslint-disable no-multi-spaces */
const os      = require('os')
const util    = require('util')
const mkdirp  = util.promisify(require('mkdirp'))
const request = require('request-promise-native')
const fs      = require('./fs-as-promise')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/lib/registry')
debug('lib/registry running')

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
debug(`DSAFIO_CACHE_HOME: ${DSAFIO_CACHE_HOME}`)

const DSAFIO_CACHE_FILE = process.env.DSAFIO_CACHE_FILE || `${DSAFIO_CACHE_HOME}/registry.json`
debug(`DSAFIO_CACHE_FILE: ${DSAFIO_CACHE_FILE}`)

const API_BASE_URL = 'https://api.github.com'

function get (keys) {
  debug('get(): running')

  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    debug(`get(): invalid argument: ${typeof keys} ${keys}`)

    return Promise.reject(new Error('registry.get() accepts an array of configuration keys'))
  }

  if (REGISTRY) {
    debug('get(): returning registry from memory cache')

    return Promise.resolve(Object.assign({}, REGISTRY))
  }

  debug('get(): memory cache empty. reading registry file from disk')

  return Promise.resolve()
    .then(loadFromDisk)
    .catch(error => {
      if (error.code === 'ENOENT') {
        debug('registry file absent. loading from github api')

        return loadFromApi()
      }

      throw error
    })
    .then(cacheOnMemory)
    .then(cacheOnDisk)
}

function loadFromDisk () {
  debug('loadFromDisk(): running')

  return fs.readFile(DSAFIO_CACHE_FILE, 'utf8')
    // .then(JSON.parse)
    .then(content => {
      debug(`registry disk cache content: ${content}`)

      return JSON.parse(content)
    })
}

function loadFromApi () {
  debug('loadFromApi(): running')

  return request.get(`${API_BASE_URL}/repos/dsafio/challenges/contents/registry.json`, {
    headers: { 'User-Agent': 'dsafio/dsafio' }
  })
    .then(payload => {
      debug('loadFromApi(): request to github api completed')
      debug(`loadFromApi(): payload: ${payload}`)

      return JSON.parse(payload)
    })
    .then(payload => payload.content)
    .then(raw => Buffer.from(raw, 'base64').toString())
    .then(JSON.parse)
}

function cacheOnMemory (registry) {
  debug('cacheOnMemory(): running')

  return Promise.resolve(REGISTRY = Object.assign({}, registry))
}

function cacheOnDisk (registry) {
  debug('cacheOnMemory(): running')

  return mkdirp(DSAFIO_CACHE_HOME)
    .then(() => fs.writeFile(DSAFIO_CACHE_FILE, JSON.stringify(registry), 'utf8'))
    .then(() => registry)
}

function update () {
  debug('update(): running')

  return loadFromApi()
    .then(cacheOnMemory)
    .then(cacheOnDisk)
}

module.exports = { get, update }
