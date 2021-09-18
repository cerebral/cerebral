# Cerebral

A declarative state and side effects management solution for popular JavaScript frameworks

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![bitHound Score][bithound-image]][bithound-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
[![Discord][discord-image]][discord-url]
<img src="images/logo.png" width="300" align="center">

## Maintainer needed

https://gist.github.com/christianalfoni/f1c4bfe320dcb24c403635d9bca3fa40

## Documentation

* [Current Cerebral (2.x and up)](http://www.cerebraljs.com/)
* [Previous Cerebral (1.x)](http://cerebral-website.herokuapp.com/)

## Contribute

The entire Cerebral codebase has been rewritten to encourage contributions. The code is cleaned up, commented and all code is in a "monorepo". That means you can run tests across projects and general management of the code is simplified a lot.

1.  Clone the monorepo: `git clone https://github.com/cerebral/cerebral.git`
2.  In root: `npm install`

The packages are located under `packages` folder and there is **no need** to run `npm install` for each package.

### Using monorepo for your own apps

If you want to use Cerebral 2 directly from your cloned repo, you can create a symlinks for following
directories into the `node_modules` directory of your app:

* `packages/node_modules/cerebral`
* `packages/node_modules/function-tree`
* `packages/node_modules/@cerebral`

If your app and the cerebral monorepo are in the same folder you can do from inside your
app directory:

```sh
$ ln -s ../../cerebral/packages/node_modules/cerebral/ node_modules/
# ...
```

Just remember to unlink the package before installing it from npm:

```sh
$ unlink node_modules/cerebral
# ...
```

### Running demos

Go to the respective `packages/demos/some-demo-folder` and run `npm start`

### Testing

You can run all tests in all packages from root:

`npm test`

Or you can run tests for specific packages by going to package root and do the same:

`npm test`

### Changing the code

When you make a code change you should create a branch first. When the code is changed and backed up by a test you can commit it from **the root** using:

`npm run commit`

This will give you a guide to creating a commit message. Then you just push and create a pull request as normal on Github.

### Release process

* Review and merge PRs into `next` branch. It is safe to use "Update branch", the commit created by Github will not be part of `next` history
* If changes to `repo-cooker`, clean Travis NPM cache
* From command line:

```bash
$ git checkout next
$ git pull
$ npm install # make sure any new dependencies are installed
$ npm install --no-save repo-cooker # needed to test release, make sure you have latest
$ npm run release # and check release notes
$ git checkout master
$ git pull
$ git merge --ff-only next
$ git push
```

[npm-image]: https://img.shields.io/npm/v/cerebral.svg?style=flat
[npm-url]: https://npmjs.org/package/cerebral
[travis-image]: https://img.shields.io/travis/cerebral/cerebral.svg?style=flat
[travis-url]: https://travis-ci.org/cerebral/cerebral
[coverage-image]: https://img.shields.io/coveralls/github/cerebral/cerebral.svg?style=flat
[coverage-url]: https://coveralls.io/github/cerebral/cerebral
[bithound-image]: https://img.shields.io/bithound/code/github/cerebral/cerebral.svg?style=flat
[bithound-url]: https://www.bithound.io/github/cerebral/cerebral
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/
[discord-image]: https://img.shields.io/badge/discord-join%20chat-blue.svg?style=flat
[discord-url]: https://discord.gg/0kIweV4bd2bwwsvH
