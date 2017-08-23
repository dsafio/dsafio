#!/usr/bin/env node

const program = require('commander')
const package = require('../package.json')

program
  .version(package.version)
  .parse(process.argv)

console.log('Hello fom Dsafio!')
