/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/* eslint-disable no-multi-spaces */
const os = require('os')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/lib/helpers/constants')
debug('lib/helpers/constants running')

const HOME = os.homedir()

const CACHE_HOME = process.env.DSAFIO_CACHE_HOME || (process.env.XDG_CACHE_HOME || `${HOME}/.cache`).concat('/dsafio')
debug(`CACHE_HOME: ${CACHE_HOME}`)

const CONFIG_HOME = process.env.DSAFIO_CONFIG_HOME || (process.env.XDG_CONFIG_HOME || `${HOME}/.config`).concat('/dsafio')
debug(`CONFIG_HOME: ${CONFIG_HOME}`)

const DATA_HOME = process.env.DSAFIO_DATA_HOME || (process.env.XDG_DATA_HOME || `${HOME}/.local/share`).concat('/dsafio')
debug(`DATA_HOME: ${DATA_HOME}`)

const CHALLENGE_HOME = process.env.DSAFIO_CHALLENGE_HOME || `${HOME}/dsafio`
debug(`DATA_HOME: ${DATA_HOME}`)

Object.defineProperties(module.exports, {
  'CACHE_HOME': { value: CACHE_HOME },
  'CONFIG_HOME': { value: CONFIG_HOME },
  'DATA_HOME': { value: DATA_HOME },
  'CHALLENGE_HOME': { value: CHALLENGE_HOME }
})
