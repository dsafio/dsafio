#!/usr/bin/env node

const program = require('commander')
const fs      = require('fs')
const os      = require('os')
const package = require('../package.json')
const config  = require('../lib/config')

program
  .version(package.version)
  .parse(process.argv)

const operation = program.args.shift()

if (!['get', 'set'].includes(operation)) {
  console.error('Invalid config operation. See --help for more info.')
  process.exit(1)
}

switch (operation) {

  case 'get':
    var args

    if (program.args.length) args = program.args

    config.get(args)
      .then(entries => Object.keys(entries)
        .map(key => `${key}=${entries[key]}`)
        .join('\n'))
      .then(console.info.bind(console))
      .catch(error => {
        console.error(error)
        process.exit(1)
      })
    break;

  case 'set':
    Promise.resolve()
      .then(() => {
        if (!program.args[0] || !program.args[1]) {
          throw new Error('Invalid key/value')
        }

        return { [program.args[0]]: program.args[1] }
      })
      .then(config.set)
      .catch(error => {
        console.error('Not implemented yet.')
        process.exit(1)
      })
    break;
}
