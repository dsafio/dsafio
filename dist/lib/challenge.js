"use strict";
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var mkdirp = require("util").promisify(require("mkdirp"));
var axios_1 = require("axios");
var fs = require("./fs-as-promise");
var pick_1 = require("./helpers/pick");
var registry = require("./registry");
var DSAFIO_DATA_HOME = process.env.DSAFIO_DATA_HOME ||
    process.env.XDG_DATA_HOME ||
    os.homedir() + "/dsafio";
var CHALLENGES_BASE_URL = "https://api.github.com/repos/dsafio/challenges/contents/challenges";
/**
 * Fetches one or more challenges from the challenges repository.
 *
 * @param {undefined|Array} keys Acccepts array of challenge keys.
 * @return {Promise} A promise for a list of challenge objects and its
 *                   respective contents.
 *
 * @see https://github.com/dsafio/challenges
 * @see https://github.com/dsafio/challenges/blob/master/registry.json
 */
exports.fetch = function (keys, options) {
    return options && options.inDisk
        ? fetchInDisk(keys)
        : registry
            .get(["challenges"])
            .then(function (registry) { return registry.challenges; })
            .then(function (challenges) {
            return !keys ? challenges : pick_1.pick(challenges, keys);
        })
            .then(function (challenges) {
            return Promise.all(Object.keys(challenges).map(function (challenge) {
                return Promise.all(["index.js", "readme.md", "test.js"].map(function (filename) {
                    return axios_1.default
                        .get(CHALLENGES_BASE_URL + "/" + challenge + "/" + filename, {
                        headers: { "User-Agent": "dsafio/dsafio" }
                    })
                        .then(function (response) { return response.data; })
                        .then(function (file) { return ({
                        name: file.name,
                        content: Buffer.from(file.content, "base64").toString("ascii")
                    }); });
                })).then(function (files) { return ({
                    title: challenge,
                    files: files
                }); });
            }));
        });
};
var fetchInDisk = function (keys) {
    return mkdirp(DSAFIO_DATA_HOME)
        .then(exports.fetch(keys))
        .then(function (challenges) {
        return Promise.all(challenges.map(function (challenge) {
            return mkdirp(DSAFIO_DATA_HOME + "/" + challenge.title).then(function () {
                return Promise.all(challenge.files.map(function (file) {
                    var filepath = DSAFIO_DATA_HOME + "/" + challenge.title + "/" + file.name;
                    return fs.writeFile(filepath, file.content, "utf8");
                }));
            });
        })).then(function () { return undefined; });
    } // noop
    );
};
