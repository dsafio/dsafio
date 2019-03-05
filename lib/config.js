/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/* eslint-disable no-multi-spaces */
const util   = require('util')
const fs     = require('./fs-as-promise')
const mkdirp = util.promisify(require('mkdirp'))
const pick   = require('./helpers/pick')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/lib/config')
debug('lib/config running')

const { CONFIG_HOME } = require('./helpers/constants')

const CONFIG_FILE = process.env.DSAFIO_CONFIG_FILE || `${CONFIG_HOME}/.dsafiorc`
debug(`CONFIG_FILE: ${CONFIG_FILE}`)

function get (keys) {
  debug('get(): running')

  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    debug(`get(): invalid argument: ${typeof keys} ${keys}`)

    return Promise.reject(new Error('config.get() accepts an array of configuration keys'))
  }

  debug('get(): reading configuration')

  return fs.readFile(CONFIG_FILE, 'utf8')
    .then(contents => {
      contents = contents.trim().length
        ? contents
        : '{}'

      debug('get(): parsing JSON')

      return JSON.parse(contents)
    })
    .then(config => {
      debug('get(): filtering configs')

      return !keys
        ? config
        : pick(config, keys)
    })
}

function set (entries) {
  debug('set(): running')

  if (typeof entries !== 'object' || !Object.keys(entries).length) {
    debug(`set(): invalid argument: ${typeof entries} ${entries}`)

    return Promise.reject(new Error('config.set() requires an object with configuration key/value pairs'))
  }

  debug('set(): reading configuration')

  return get()
    .catch(error => {
      // ENOENT errors (file absence) will be ignored
      if (error.code === 'ENOENT') {
        debug('configuration file absent. proceeding with fallback')

        return {}
      }

      throw error
    })
    .then(prevConfig => {
      debug('set(): merging current and new configuration')

      return Object.assign({}, prevConfig, entries)
    })
    .then(config => {
      debug('set(): generating JSON')

      return JSON.stringify(config, null, '  ')
    })
    .then(json => {
      debug('set(): writing configuration')

      return mkdirp(CONFIG_HOME)
        .then(fs.writeFile(CONFIG_FILE, json, 'utf8'))
    })
}

module.exports = { get, set, CONFIG_FILE: CONFIG_FILE }
