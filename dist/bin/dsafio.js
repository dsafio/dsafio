#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var pkg = require("../package.json");
program
    .version(pkg.version)
    .command("config <get|set> [key=value...]", "get/set user configuration")
    .command("update", "updates the registry from GitHub")
    .parse(process.argv);
