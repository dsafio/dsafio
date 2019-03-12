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
var axios_1 = require("axios");
var fs = require("./fs-as-promise");
var pick_1 = require("./helpers/pick");
/**
 * Holds the entire registry in RAM.
 */
var REGISTRY = null;
var CACHE_HOME = require("./helpers/constants").CACHE_HOME;
var CACHE_FILE = process.env.DSAFIO_CACHE_FILE || CACHE_HOME + "/registry.json";
var API_BASE_URL = "https://api.github.com";
exports.get = function (keys) {
    return REGISTRY
        ? Promise.resolve(__assign({}, REGISTRY))
        : Promise.resolve()
            .then(loadFromDisk)
            .catch(function (error) {
            if (error.code === "ENOENT")
                return loadFromApi();
            throw error;
        })
            .then(cacheOnMemory)
            .then(cacheOnDisk)
            .then(function (entries) { return (!keys ? entries : pick_1.pick(entries, keys)); });
};
var loadFromDisk = function () { return fs.readFile(CACHE_FILE, "utf8").then(JSON.parse); };
var loadFromApi = function () {
    return axios_1.default
        .get(API_BASE_URL + "/repos/dsafio/challenges/contents/registry.json", {
        headers: { "User-Agent": "dsafio/dsafio" }
    })
        .then(function (response) { return response.data.content; })
        .then(function (raw) { return Buffer.from(raw, "base64").toString(); })
        .then(JSON.parse);
};
var cacheOnMemory = function (registry) { return Promise.resolve((REGISTRY = registry)); };
var cacheOnDisk = function (registry) {
    return mkdirp(CACHE_HOME)
        .then(function () { return fs.writeFile(CACHE_FILE, JSON.stringify(registry), "utf8"); })
        .then(function () { return registry; });
};
exports.update = function () {
    return loadFromApi()
        .then(cacheOnMemory)
        .then(cacheOnDisk);
};
