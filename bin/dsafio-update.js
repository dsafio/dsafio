#!/usr/bin/env node
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const program = require("commander");
const pkg = require("../package.json");
const registry = require("../lib/registry");

program.version(pkg.version).parse(process.argv);

registry.update().catch(error => {
  console.error("Something went wrong while updating the registry");
  process.exit(1);
});
