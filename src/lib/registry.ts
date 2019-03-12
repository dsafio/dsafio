/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const mkdirp = require("util").promisify(require("mkdirp"));

import axios from "axios";
import * as fs from "./fs-as-promise";
import { pick } from "./helpers/pick";

/**
 * Holds the entire registry in RAM.
 */
var REGISTRY = null;

const { CACHE_HOME } = require("./helpers/constants");

const CACHE_FILE =
  process.env.DSAFIO_CACHE_FILE || `${CACHE_HOME}/registry.json`;

const API_BASE_URL = "https://api.github.com";

export const get = (keys: string[]) =>
  REGISTRY
    ? Promise.resolve({ ...REGISTRY })
    : Promise.resolve()
        .then(loadFromDisk)
        .catch(error => {
          if (error.code === "ENOENT") return loadFromApi();

          throw error;
        })
        .then(cacheOnMemory)
        .then(cacheOnDisk)
        .then(entries => (!keys ? entries : pick(entries, keys)));

const loadFromDisk = () => fs.readFile(CACHE_FILE, "utf8").then(JSON.parse);

const loadFromApi = () =>
  axios
    .get(`${API_BASE_URL}/repos/dsafio/challenges/contents/registry.json`, {
      headers: { "User-Agent": "dsafio/dsafio" }
    })
    .then(response => response.data.content)
    .then(raw => Buffer.from(raw, "base64").toString())
    .then(JSON.parse);

const cacheOnMemory = registry => Promise.resolve((REGISTRY = registry));

const cacheOnDisk = registry =>
  mkdirp(CACHE_HOME)
    .then(() => fs.writeFile(CACHE_FILE, JSON.stringify(registry), "utf8"))
    .then(() => registry);

export const update = () =>
  loadFromApi()
    .then(cacheOnMemory)
    .then(cacheOnDisk);