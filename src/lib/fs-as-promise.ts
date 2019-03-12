/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const fs = require("fs");
const util = require("util");

export const readFile = util.promisify(fs.readFile);
export const writeFile = util.promisify(fs.writeFile);
