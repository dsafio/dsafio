/* eslint-disable no-multi-spaces */
const os       = require('os')
const util     = require('util')
const mkdirp   = util.promisify(require('mkdirp'))
const request  = require('request-promise-native')
const fs       = require('./fs-as-promise')
const registry = require('./registry')
/* eslint-enable no-multi-spaces */

const DSAFIO_DATA_HOME = process.env.DSAFIO_DATA_HOME || process.env.XGD_DATA_HOME || `${os.homedir()}/dsafio`

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
  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    return Promise.reject(new Error('challenge.fetch() accepts an array of challenge keys'))
  }

  if (![null, undefined].includes(options) && options.constructor !== Object) {
    return Promise.reject(new Error("'options' must be an object"))
  }

  if (options && options.inDisk) {
    return fetchInDisk(keys, options)
  }

  return registry.get(['challenges'])
    .then(registry => registry.challenges)
    .then(challenges => {
      if (!keys) {
        return challenges
      }

      return keys.reduce((subset, key) => {
        if (!challenges.hasOwnProperty(key)) {
          throw new Error(`Invalid challenge key '${key}'`)
        }

        return Object.assign(subset, { [key]: challenges[key] })
      }, {})
    })
    .then(challenges => {
      return Promise.all(Object.keys(challenges).map(challenge => {
        return Promise.all([
          'index.js',
          'readme.md',
          'test.js'
        ].map(filename => {
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
  return mkdirp(DSAFIO_DATA_HOME)
    .then(fetch(keys))
    .then(challenges => {
      return Promise.all(challenges.map(challenge => {
        return mkdirp(`${DSAFIO_DATA_HOME}/${challenge.title}`)
          .then(() => {
            return Promise.all(challenge.files.map(function (file) {
              const filepath = `${DSAFIO_DATA_HOME}/${challenge.title}/${file.name}`
              return fs.writeFile(filepath, file.content, 'utf8')
            }))
          })
      }))
        .then(() => undefined) // noop
    })
}

module.exports = { fetch }
