/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const axios = require("axios");
const mkdirp = require("util").promisify(require("mkdirp"));
const fs = require("./fs-as-promise");
const pick = require("lodash.pick");

/**
 * Holds the entire registry in RAM.
 */
var REGISTRY = null;

const { CACHE_HOME } = require("./helpers/constants");

const CACHE_FILE =
  process.env.DSAFIO_CACHE_FILE || `${CACHE_HOME}/registry.json`;

const API_BASE_URL = "https://api.github.com";

function get(keys) {
  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    return Promise.reject(
      new Error("registry.get() accepts an array of configuration keys")
    );
  }

  if (REGISTRY) {
    return Promise.resolve({ ...REGISTRY });
  }

  return Promise.resolve()
    .then(loadFromDisk)
    .catch((error) => {
      if (error.code === "ENOENT") return loadFromApi();

      throw error;
    })
    .then(cacheOnMemory)
    .then(cacheOnDisk)
    .then((entries) => {
      return !keys ? entries : pick(entries, keys);
    });
}

function loadFromDisk() {
  return fs.readFile(CACHE_FILE, "utf8").then(JSON.parse);
}

function loadFromApi() {
  return axios
    .get(`${API_BASE_URL}/repos/dsafio/challenges/contents/registry.json`, {
      headers: { "User-Agent": "dsafio/dsafio" },
    })
    .then((response) => response.data.content)
    .then((raw) => Buffer.from(raw, "base64").toString())
    .then(JSON.parse);
}

function cacheOnMemory(registry) {
  REGISTRY = { ...registry };

  return Promise.resolve(REGISTRY);
}

function cacheOnDisk(registry) {
  return mkdirp(CACHE_HOME)
    .then(() => fs.writeFile(CACHE_FILE, JSON.stringify(registry), "utf8"))
    .then(() => registry);
}

function update() {
  return loadFromApi().then(cacheOnMemory).then(cacheOnDisk);
}

module.exports = { get, update };
