#!/usr/bin/env node
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/* eslint-disable no-multi-spaces */
const program = require('commander')
const pkg     = require('../package.json')
/* eslint-enable no-multi-spaces */

const debug = require('debug')('dsafio/cli')
debug('bootstrapping cli')

program
  .version(pkg.version)
  .command('config <get|set> [key=value...]', 'get/set user configuration')
  .command('fetch <challenge>', 'downloads a challenge from GitHub')
  .command('update', 'updates the registry from GitHub')
  .parse(process.argv)
