/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const debug = require('debug')('dsafio/lib/helpers/pick')
debug('lib/config/pick running')

/**
 * Implements the `pick` method of lodash, throwing errors when keys are absent.
 * The original package is not used due to lodash custom builds being quite big.
 *
 * @see https://www.npmjs.com/package/lodash.pick
 * @see https://lodash.com/docs/#pick
 */
const pick = (source, keys) => {
  debug('pick() running')

  debug(`source: ${typeof source} ${source}`)
  debug(`keys: ${typeof keys} ${keys}`)

  if (!source || typeof source !== 'object') {
    throw new Error('Parameter `source` must be an object')
  }

  if (keys !== undefined && !Array.isArray(keys)) {
    throw new Error('Parameter `keys` must be an array')
  }

  if (!keys) {
    return source
  }

  return keys.reduce((subset, key) => {
    if (!source.hasOwnProperty(key)) {
      throw new Error(`Key \`${key}\` inexistent`)
    }

    return Object.assign(subset, { [key]: source[key] })
  }, {})
}

module.exports = pick
