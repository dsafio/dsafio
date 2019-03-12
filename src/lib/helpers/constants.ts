/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const os = require("os");

const HOME = os.homedir();

export const CACHE_HOME =
  process.env.DSAFIO_CACHE_HOME ||
  (process.env.XDG_CACHE_HOME || `${HOME}/.cache`).concat("/dsafio");

export const CONFIG_HOME =
  process.env.DSAFIO_CONFIG_HOME ||
  (process.env.XDG_CONFIG_HOME || `${HOME}/.config`).concat("/dsafio");

export const DATA_HOME =
  process.env.DSAFIO_DATA_HOME ||
  (process.env.XDG_DATA_HOME || `${HOME}/.local/share`).concat("/dsafio");

export const CHALLENGE_HOME =
  process.env.DSAFIO_CHALLENGE_HOME || `${HOME}/dsafio`;
