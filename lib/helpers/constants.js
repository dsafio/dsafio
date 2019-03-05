/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const os = require("os");

const HOME = os.homedir();

const CACHE_HOME =
  process.env.DSAFIO_CACHE_HOME ||
  (process.env.XDG_CACHE_HOME || `${HOME}/.cache`).concat("/dsafio");

const CONFIG_HOME =
  process.env.DSAFIO_CONFIG_HOME ||
  (process.env.XDG_CONFIG_HOME || `${HOME}/.config`).concat("/dsafio");

const DATA_HOME =
  process.env.DSAFIO_DATA_HOME ||
  (process.env.XDG_DATA_HOME || `${HOME}/.local/share`).concat("/dsafio");

const CHALLENGE_HOME = process.env.DSAFIO_CHALLENGE_HOME || `${HOME}/dsafio`;

Object.defineProperties(module.exports, {
  CACHE_HOME: { value: CACHE_HOME },
  CONFIG_HOME: { value: CONFIG_HOME },
  DATA_HOME: { value: DATA_HOME },
  CHALLENGE_HOME: { value: CHALLENGE_HOME }
});
