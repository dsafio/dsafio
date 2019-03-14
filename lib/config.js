/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const util = require("util");
const fs = require("./fs-as-promise");
const mkdirp = util.promisify(require("mkdirp"));
const pick = require("lodash.pick");

const { CONFIG_HOME } = require("./helpers/constants");

const CONFIG_FILE =
  process.env.DSAFIO_CONFIG_FILE || `${CONFIG_HOME}/.dsafiorc`;

function get(keys) {
  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    return Promise.reject(
      new Error("config.get() accepts an array of configuration keys")
    );
  }

  return fs
    .readFile(CONFIG_FILE, "utf8")
    .then(contents => {
      contents = contents.trim().length ? contents : "{}";

      return JSON.parse(contents);
    })
    .then(config => {
      return !keys ? config : pick(config, keys);
    });
}

function set(entries) {
  if (typeof entries !== "object" || !Object.keys(entries).length) {
    return Promise.reject(
      new Error(
        "config.set() requires an object with configuration key/value pairs"
      )
    );
  }

  return get()
    .catch(error => {
      // ENOENT errors (file absence) will be ignored
      if (error.code === "ENOENT") return {};

      throw error;
    })
    .then(prevConfig => ({ ...prevConfig, ...entries }))
    .then(config => JSON.stringify(config, null, "  "))
    .then(json => {
      return mkdirp(CONFIG_HOME).then(fs.writeFile(CONFIG_FILE, json, "utf8"));
    });
}

module.exports = { get, set, CONFIG_FILE: CONFIG_FILE };
