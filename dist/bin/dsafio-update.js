#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var registry = require("../lib/registry");
program.parse(process.argv);
registry.update().catch(function (error) {
    console.error("Something went wrong while updating the registry");
    process.exit(1);
});
