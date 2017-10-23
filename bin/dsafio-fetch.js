#!/usr/bin/env node

/* eslint-disable no-multi-spaces */
const program   = require('commander')
const pkg       = require('../package.json')
const challenge = require('../lib/challenge')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/cli/fetch')
debug('running dsafio-fetch')

program
  .version(pkg.version)
  .parse(process.argv)

const key = program.args.shift()
debug(`challenge: '${key}'`)

if (typeof key !== 'string' || !key.length) {
  console.error('Invalid challenge key. See --help for more info.')
  process.exit(1)
}

challenge.fetch([key], {inDisk: true})
  .catch(error => {
    debug(error)

    console.error(`Something went wrong while downloading challenge '${key}'`)
    process.exit(1)
  })
