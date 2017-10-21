#!/usr/bin/env node

/* eslint-disable no-multi-spaces */
const program = require('commander')
const pkg     = require('../package.json')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/cli')
debug('bootstrapping cli')

program
  .version(pkg.version)
  .command('config <get|set> [key=value...]', 'get/set user configuration')
  .command('update', 'updates the registry from GitHub')
  .parse(process.argv)
