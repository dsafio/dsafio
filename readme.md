# [Dsafio](https://github.com/dsafio/dsafio) 🤘

[![Travis CI](https://travis-ci.org/dsafio/dsafio.svg?branch=master)](https://travis-ci.org/dsafio/dsafio)
[![Snyk](https://snyk.io/test/github/dsafio/dsafio/badge.svg)](https://snyk.io/test/github/dsafio/dsafio)

Practicing tool for coders.

## Up and Running 🏃

It's a [Commander.js](https://github.com/tj/commander.js) powered [Node.js](https://nodejs.org) CLI.

**Requirements**

You need Node.js to run the CLI. We recommend [asdf](https://asdf-vm.com) to manage your Node.js environment.

**Install the CLI**

```
npm install -g dsafio
```

## Contributing 👷

Dsafio is a Node.js command-line tool. You'll want to have the development version of the `dsafio` command in your `$PATH`. Besides it, it will feel like a normal Node.js project for you. It's built with [Commander.js](https://github.com/tj/commander.js), tested with [Mocha](https://mochajs.org), [Chai](https://www.chaijs.com) and [Sinon.JS](https://sinonjs.org), with [Prettier](https://prettier.io) as coding standard.

**Development environment**

Depending on how is your `$PATH`, you might need to uninstall `dsafio` as global:

```
npm uninstall -g dsafio
```

It's a typical Node.js project. Dependencies are managed via [npm](https://github.com/npm/npm):

```
npm install
```

Now, just link the development executables:

```
npm link
```

`dsafio` command should now be available in your shell.

**Unlinking the development version**

If you ever need to unlink the global version (eg.: you want to install the production version directly from npm), you will want to unlink the development version first:

```
npm unlink
```

**Conventional Commits**

We use [Conventional Commits](https://www.conventionalcommits.org) in our commit history. It is a specification for commit messages that help us automate versioning processes. Please refer to its website for more information.

## Testing ✅

Test can be run with the following command:

```
npm test
```

It's possible to run them in watch mode:

```
npm run test:watch
```

## Style Guide 🌷

We use [Prettier](https://prettier.io).

## License 📄

[MIT](license)
