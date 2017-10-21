#!/usr/bin/env node

/* eslint-disable no-multi-spaces */
const program  = require('commander')
const pkg      = require('../package.json')
const registry = require('../lib/registry')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/cli/update')
debug('running dsafio-update')

program
  .version(pkg.version)
  .parse(process.argv)

registry.update()
  .catch(error => {
    debug(error)

    console.error('Something went wrong while updating the registry')
    process.exit(1)
  })
