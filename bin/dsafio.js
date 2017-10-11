#!/usr/bin/env node

/* eslint-disable no-multi-spaces */
const program = require('commander');
const pkg = require('../package.json');
/* eslint-enable no-multi-spaces */

program
  .version(pkg.version)
  // .command('config <get|set> [key=value...]', 'get/set user configuration')
  .command('config <get>, get user configuration')
  .command('config <set>, set user configuration')
  .parse(process.argv);
