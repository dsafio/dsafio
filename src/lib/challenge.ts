/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const os = require("os");
const mkdirp = require("util").promisify(require("mkdirp"));

import axios from "axios";
import * as fs from "./fs-as-promise";
import { pick } from "./helpers/pick";
import * as registry from "./registry";

const DSAFIO_DATA_HOME =
  process.env.DSAFIO_DATA_HOME ||
  process.env.XDG_DATA_HOME ||
  `${os.homedir()}/dsafio`;

const CHALLENGES_BASE_URL =
  "https://api.github.com/repos/dsafio/challenges/contents/challenges";

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
export const fetch = (keys?: string[], options?: { inDisk: Boolean }) =>
  options && options.inDisk
    ? fetchInDisk(keys)
    : registry
        .get(["challenges"])
        .then(registry => registry.challenges)
        .then(challenges => {
          return !keys ? challenges : pick(challenges, keys);
        })
        .then(challenges => {
          return Promise.all(
            Object.keys(challenges).map(challenge => {
              return Promise.all(
                ["index.js", "readme.md", "test.js"].map(filename => {
                  return axios
                    .get(`${CHALLENGES_BASE_URL}/${challenge}/${filename}`, {
                      headers: { "User-Agent": "dsafio/dsafio" }
                    })
                    .then(response => response.data)
                    .then(file => ({
                      name: file.name,
                      content: Buffer.from(file.content, "base64").toString(
                        "ascii"
                      )
                    }));
                })
              ).then(files => ({
                title: challenge,
                files
              }));
            })
          );
        });

const fetchInDisk = (keys?: string[]) =>
  mkdirp(DSAFIO_DATA_HOME)
    .then(fetch(keys))
    .then(
      challenges =>
        Promise.all(
          challenges.map(challenge => {
            return mkdirp(`${DSAFIO_DATA_HOME}/${challenge.title}`).then(() => {
              return Promise.all(
                challenge.files.map(function(file) {
                  const filepath = `${DSAFIO_DATA_HOME}/${challenge.title}/${
                    file.name
                  }`;

                  return fs.writeFile(filepath, file.content, "utf8");
                })
              );
            });
          })
        ).then(() => undefined) // noop
    );
