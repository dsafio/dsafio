#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var config = require("../lib/config");
program.parse(process.argv);
var operation = program.args.shift();
if (!["get", "set"].includes(operation)) {
    console.error("Invalid config operation. See --help for more info.");
    process.exit(1);
}
switch (operation) {
    case "get":
        var args;
        if (program.args.length)
            args = program.args;
        config
            .get(args)
            .then(function (entries) {
            return Object.keys(entries)
                .map(function (key) { return key + "=" + entries[key]; })
                .join("\n");
        })
            .then(console.info.bind(console))
            .catch(function (error) {
            ["EACCES", "ENOENT"].includes(error.code)
                ? console.error("Inaccessible or inexistent configuration file")
                : console.error("Something went wrong while reading configuration file");
            process.exit(1);
        });
        break;
    case "set":
        Promise.resolve()
            .then(function () {
            var _a;
            if (!program.args[0] || !program.args[1]) {
                throw new Error("Invalid key/value");
            }
            return _a = {}, _a[program.args[0]] = program.args[1], _a;
        })
            .then(function (entries) {
            config.set(entries);
        })
            .catch(function (error) {
            ["EACCES", "ENOENT"].includes(error.code)
                ? console.error("Inaccessible or inexistent configuration file")
                : console.error(error.message);
            process.exit(1);
        });
        break;
}
