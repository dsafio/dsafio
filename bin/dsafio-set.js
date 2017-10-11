#!/usr/bin/env node

const program = require('commander');

const operation = program.args.shift();

var args;

if (program.args.length) args = program.args;

Promise.resolve()
  .then(() => {
    if (!program.args[0] || !program.args[1]) {
      throw new Error('Invalid key/value');
    }

    return { [program.args[0]]: program.args[1] };
  })
  .then(config.set)
  .catch(error => {
    ['EACCES', 'ENOENT'].includes(error.code)
      ? console.error('Inaccessible or inexistent configuration file')
      : console.error('Something went wrong while reading configuration file');
    process.exit(1);
  });
