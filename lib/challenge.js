/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

const os = require("os");
const axios = require("axios");
const mkdirp = require("util").promisify(require("mkdirp"));
const fs = require("./fs-as-promise");
const pick = require("lodash.pick");
const registry = require("./registry");

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
function fetch(keys, options) {
  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    return Promise.reject(
      new Error("challenge.fetch() accepts an array of challenge keys")
    );
  }

  if (![null, undefined].includes(options) && options.constructor !== Object) {
    return Promise.reject(new Error("'options' must be an object"));
  }

  if (options && options.inDisk) return fetchInDisk(keys, options);

  return registry
    .get(["challenges"])
    .then(entries => {
      if (!entries || !entries.challenges) {
        throw new Error("Challenges not found");
      }

      return entries.challenges;
    })
    .then(challenges => (!keys ? challenges : pick(challenges, keys)))
    .then(challenges =>
      Promise.all(Object.keys(challenges).map(fetchChallenge))
    );
}

function fetchChallenge(challenge) {
  return Promise.all(
    ["index.js", "readme.md", "test.js"].map(filename => {
      return axios
        .get(`${CHALLENGES_BASE_URL}/${challenge}/${filename}`, {
          headers: { "User-Agent": "dsafio/dsafio" }
        })
        .then(response => JSON.parse(response.body))
        .then(file => ({
          name: file.name,
          content: Buffer.from(file.content, "base64").toString("ascii")
        }));
    })
  ).then(files =>
    files.reduce(
      (challenge, file) => ({
        ...challenge,
        files: [...challenge.files, file]
      }),
      {
        name: challenge,
        files: []
      }
    )
  );
}

function fetchInDisk(keys, options) {
  return mkdirp(DSAFIO_DATA_HOME)
    .then(fetch(keys))
    .then(challenges => Promise.all(challenges.map(fetchChallengeInDisk)))
    .then(() => undefined); // noop
}

function fetchChallengeInDisk(key) {
  let challenge;

  return fetch([key])
    .then(challenges => (challenge = challenges[0]))
    .then(() => mkdirp(`${DSAFIO_DATA_HOME}/${challenge.name}`))
    .then(() =>
      Promise.all(
        challenge.files.map(file => {
          const filepath = `${DSAFIO_DATA_HOME}/${challenge.name}/${file.name}`;

          return fs.writeFile(filepath, file.content, "utf8");
        })
      )
    )
    .then(() => undefined); // noop
}

module.exports = { fetch };
