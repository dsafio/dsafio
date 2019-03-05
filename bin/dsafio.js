#!/usr/bin/env node
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const program = require("commander");
const pkg = require("../package.json");

program
  .version(pkg.version)
  .command("config <get|set> [key=value...]", "get/set user configuration")
  .command("update", "updates the registry from GitHub")
  .parse(process.argv);
