/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/* eslint-disable no-multi-spaces */
const os       = require('os')
const util     = require('util')
const mkdirp   = util.promisify(require('mkdirp'))
const request  = require('request-promise-native')
const fs       = require('./fs-as-promise')
const pick     = require('./helpers/pick')
const registry = require('./registry')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/lib/challenge')
debug('lib/challenge running')

const DSAFIO_DATA_HOME = process.env.DSAFIO_DATA_HOME || process.env.XGD_DATA_HOME || `${os.homedir()}/dsafio`
debug(`DSAFIO_DATA_HOME: ${DSAFIO_DATA_HOME}`)

const CHALLENGES_BASE_URL = 'https://api.github.com/repos/dsafio/challenges/contents/challenges'

/**
 * Fetches one or more challenges from the challenges repository.
 *
 * @param {undefined|Array} keys Acccepts array of challenge keys.
 * @return {Promise} A promise for a list of challenge objects and its
 *                   respective contents.
 *
 * @see https://github.com/dsafio/challenges
 * @see https://github.com/dsafio/challenges/blob/master/registry.json
 */
function fetch (keys, options) {
  debug('fetch() running')

  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    debug(`fetch(): invalid argument 'key': ${typeof keys} ${keys}`)

    return Promise.reject(new Error('challenge.fetch() accepts an array of challenge keys'))
  }

  if (![null, undefined].includes(options) && options.constructor !== Object) {
    debug(`fetch(): invalid argument 'options': ${typeof options} ${options}`)

    return Promise.reject(new Error("'options' must be an object"))
  }

  if (options && options.inDisk) {
    debug('fetch(): options.inDisk is on. proceeding with fetchInDisk()')

    return fetchInDisk(keys, options)
  }

  debug('fetch(): getting challenges from registry')

  return registry.get(['challenges'])
    .then(entries => {
      if (!entries || !entries.challenges) {
        throw new Error('Challenges not present')
      }

      return entries.challenges
    })
    .then(challenges => {
      debug(`fetch(): filtering challenges`)

      return !keys
        ? challenges
        : pick(challenges, keys)
    })
    .then(challenges => {
      debug('fetch(): challenges filtered. proceeding with file downloads')

      return Promise.all(Object.keys(challenges).map(challenge => {
        return Promise.all([
          'index.js',
          'readme.md',
          'test.js'
        ].map(filename => {
          debug(`fetch(): requesting file '${filename}' of challenge '${challenge}'`)

          return request.get(`${CHALLENGES_BASE_URL}/${challenge}/${filename}`, {
            headers: { 'User-Agent': 'dsafio/dsafio' }
          })
            .then(JSON.parse)
            .then(file => ({
              name: file.name,
              content: Buffer.from(file.content, 'base64').toString('ascii')
            }))
        }))
          .then(files => ({
            title: challenge,
            files
          }))
      }))
    })
}

function fetchInDisk (keys, options) {
  debug('fetchInDisk(): running')

  debug('fetchInDisk(): trying to create DSAFIO_DATA_HOME')
  return mkdirp(DSAFIO_DATA_HOME)
    .then(fetch(keys))
    .then(challenges => {
      debug('fetchInDisk(): challenges loaded. proceeding to disk writes')
      debug(`challenges: ${challenges}`)

      return Promise.all(challenges.map(challenge => {
        debug(`fetchInDisk(): creating folder '${DSAFIO_DATA_HOME}/${challenge.title}'`)

        return mkdirp(`${DSAFIO_DATA_HOME}/${challenge.title}`)
          .then(() => {
            return Promise.all(challenge.files.map(function (file) {
              const filepath = `${DSAFIO_DATA_HOME}/${challenge.title}/${file.name}`

              debug(`fetchInDisk(): writing file '${filepath}'`)

              return fs.writeFile(filepath, file.content, 'utf8')
            }))
          })
      }))
        .then(() => undefined) // noop
    })
}

module.exports = { fetch }
