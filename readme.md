# [Dsafio](https://github.com/dsafio/dsafio) 🤘

Practicing tool for coders.

## Up and Running 🏃

It's a [commander](https://github.com/tj/commander.js) powered [Node.js](https://nodejs.org) CLI.

**Requirements**

You need Node.js to run the CLI. We recommend [Node Version Manager](https://github.com/creationix/nvm) to manage your Node.js environment.

**Install the CLI**

```
npm install -g dsafio
```

## Contributing 👷

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

**Contribution workflow**

There are steps that you need to take before being able to start to
contribute:

1. Fork the repository (if you haven't yet)
1. Clone your fork in your local machine

Then:

1. Find an issue to work on in our [issue tracker](https://github.com/dsafio/dsafio/issues)  
   _If it's a new bug or feature, [create a new one](https://github.com/dsafio/dsafio/issues/new) and describe it in detail_
1. Create a new branch to work on  
   _`git checkout -b user-page-not-loading`_
1. Commit your work  
   _One commit per contribution (use `git commit --amend`)_
1. Open a pull request and go through the review process
1. Get your contribution accepted

## Testing ✅

```
npm test
```

## Style Guide 🌷

We use [JavaScript Standard Style](https://standardjs.com).
