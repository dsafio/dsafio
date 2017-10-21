/* eslint-disable no-multi-spaces */
const os = require('os')
const fs = require('./fs-as-promise')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/lib/config')
debug('lib/config running')

const DSAFIO_CONFIG_FILE = process.env.DSAFIO_CONFIG_FILE || `${os.homedir()}/.dsafiorc`
debug(`DSAFIO_CONFIG_FILE: ${DSAFIO_CONFIG_FILE}`)

function get (keys) {
  debug('get(): running')

  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    debug(`get(): invalid argument: ${typeof keys} ${keys}`)

    return Promise.reject(new Error('config.get() accepts an array of configuration keys'))
  }

  debug('get(): reading configuration')

  return fs.readFile(DSAFIO_CONFIG_FILE, 'utf8')
    .then(contents => {
      contents = contents.trim().length
        ? contents
        : '{}'

      debug('get(): parsing JSON')

      return JSON.parse(contents)
    })
    .then(config => {
      debug('get(): filtering configs')

      if (!keys) {
        return config
      }

      return keys.reduce((subset, key) => {
        if (!config.hasOwnProperty(key)) {
          throw new Error(`Invalid config key '${key}'`)
        }

        return Object.assign(subset, { [key]: config[key] })
      }, {})
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

      return fs.writeFile(DSAFIO_CONFIG_FILE, json, 'utf8')
    })
}

module.exports = { get, set, CONFIG_FILE: DSAFIO_CONFIG_FILE }
