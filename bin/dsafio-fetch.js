#!/usr/bin/env node

const program = require("commander");
const challenge = require("../lib/challenge");

program.parse(process.argv);

const key = program.args.shift();

if (typeof key !== "string" || !key.length) {
  console.error("Invalid challenge key. See --help for more info.");
  process.exit(1);
}

challenge.fetch([key], { inDisk: true }).catch(error => {
  console.error(`Something went wrong while downloading challenge '${key}'`);
  process.exit(1);
});
