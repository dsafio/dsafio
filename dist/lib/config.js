"use strict";
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var mkdirp = require("util").promisify(require("mkdirp"));
var fs = require("./fs-as-promise");
var pick_1 = require("./helpers/pick");
var CONFIG_HOME = require("./helpers/constants").CONFIG_HOME;
exports.CONFIG_FILE = process.env.DSAFIO_CONFIG_FILE || CONFIG_HOME + "/.dsafiorc";
exports.get = function (keys) {
    return fs
        .readFile(exports.CONFIG_FILE, "utf8")
        .then(function (contents) {
        contents = contents.trim().length ? contents : "{}";
        return JSON.parse(contents);
    })
        .then(function (config) {
        return !keys ? config : pick_1.pick(config, keys);
    });
};
exports.set = function (entries) {
    return exports.get()
        .catch(function (error) {
        // ENOENT errors (file absence) will be ignored
        if (error.code === "ENOENT")
            return {};
        throw error;
    })
        .then(function (prevConfig) { return (__assign({}, prevConfig, entries)); })
        .then(function (config) { return JSON.stringify(config, null, "  "); })
        .then(function (json) {
        return mkdirp(CONFIG_HOME).then(fs.writeFile(exports.CONFIG_FILE, json, "utf8"));
    });
};
