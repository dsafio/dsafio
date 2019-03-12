"use strict";
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util = require("util");
exports.readFile = util.promisify(fs.readFile);
exports.writeFile = util.promisify(fs.writeFile);
