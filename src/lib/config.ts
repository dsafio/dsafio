/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const mkdirp = require("util").promisify(require("mkdirp"));

import * as fs from "./fs-as-promise";
import { pick } from "./helpers/pick";

const { CONFIG_HOME } = require("./helpers/constants");

export const CONFIG_FILE =
  process.env.DSAFIO_CONFIG_FILE || `${CONFIG_HOME}/.dsafiorc`;

export const get = (keys?: string[]) =>
  fs
    .readFile(CONFIG_FILE, "utf8")
    .then(contents => {
      contents = contents.trim().length ? contents : "{}";

      return JSON.parse(contents);
    })
    .then(config => {
      return !keys ? config : pick(config, keys);
    });

export const set = (entries?: Object) =>
  get()
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
