#!/usr/bin/env node

const program = require('commander');

const operation = program.args.shift();

var args;

if (program.args.length) args = program.args;

config
  .get(args)
  .then(entries =>
    Object.keys(entries)
      .map(key => `${key}=${entries[key]}`)
      .join('\n')
  )
  .then(console.info.bind(console))
  .catch(error => {
    ['EACCES', 'ENOENT'].includes(error.code)
      ? console.error('Inaccessible or inexistent configuration file')
      : console.error('Something went wrong while reading configuration file');
    process.exit(1);
  });
