"use strict";
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var HOME = os.homedir();
exports.CACHE_HOME = process.env.DSAFIO_CACHE_HOME ||
    (process.env.XDG_CACHE_HOME || HOME + "/.cache").concat("/dsafio");
exports.CONFIG_HOME = process.env.DSAFIO_CONFIG_HOME ||
    (process.env.XDG_CONFIG_HOME || HOME + "/.config").concat("/dsafio");
exports.DATA_HOME = process.env.DSAFIO_DATA_HOME ||
    (process.env.XDG_DATA_HOME || HOME + "/.local/share").concat("/dsafio");
exports.CHALLENGE_HOME = process.env.DSAFIO_CHALLENGE_HOME || HOME + "/dsafio";
