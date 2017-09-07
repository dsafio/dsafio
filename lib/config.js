const io = require('./config-io')

const debug = require('debug')('dsafio-config')

function get (keys) {
  debug('get(): running')

  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    debug('get(): invalid argument')
    throw new Error('config.get() accepts an array of configuration keys')
  }

  debug('get(): reading user configuration')
  return io.read()
    .then(contents => {
      contents = contents.trim().length
        ? contents
        : '{}'

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
}

function set (entries) {
  debug('set(): running')

  if (typeof entries !== 'object' || !Object.keys(entries).length) {
    debug('set(): invalid argument')
    throw new Error('config.set() requires an object with configuration key/value pairs')
  }

  debug('set(): arguments are ok. processing')
  return get()
    .catch(error => {
      // ENOENT errors (file absence) will be ignored
      if (error.code === 'ENOENT') {
        return {}
      }

      throw error
    })
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
}

module.exports = { get, set }
