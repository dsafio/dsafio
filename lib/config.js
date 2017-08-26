const fs   = require('fs')
const os   = require('os')
const util = require('util')
const io   = require('./config-io')

const debug  = require('debug')('dsafio-config')

function get (keys) {
  debug('get(): running')

  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    debug('get(): invalid argument')
    throw new Error('config.get() accepts an array of configuration keys')
  }

  debug('get(): reading user configuration')
  return io.read()
    .then(contents => {
      debug('get(): parsing JSON')
      return JSON.parse(contents)
    })
    .then(config => {
      debug('get(): filtering  configs')

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
    .catch(error => console.error(error) && process.exit(1))
}

function set (entries) {
  debug('set(): running')

  if (typeof entries !== 'object' || !Object.keys(entries).length) {
    debug('set(): invalid argument')
    throw new Error('config.set() requires an object with configuration key/value pairs')
  }

  debug('set(): arguments are ok. processing')
  return get()
    .then(prevConfig => {
      debug('set(): merging configurations')
      return Object.assign({}, prevConfig, entries)
    })
    .then(config => {
      debug('set(): generating JSON')
      return JSON.stringify(config, null, '  ')
    })
    .then(json => {
      debug('set(): writing user configuration')
      return io.write(json)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { get, set }
