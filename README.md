# Cerebral
A state controller with its own debugger

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![bitHound Score][bithound-image]][bithound-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]
[![js-standard-style][standard-image]][standard-url]
[![Discord][discord-image]][discord-url]

<img src="images/logo.png" width="300" align="center">

## Cerebral v1 is the current official release. Documentation is available at:
[https://www.cerebraljs.com/](http://www.cerebraljs.com/).

## Cerebral v2 is still a work in progress. Please head over to our cerebral v2 WIP website for more information:
[https://cerebral.github.io/](https://cerebral.github.io/).

## Try out Cerebral 2
To try out Cerebral 2 you can install any package with:

`npm install {cerebralPackage}@next --save --save-exact`

This will install the latest version of that package. New versions are automatically deployed whenever pull requests are merged into master.

When you want to update your packages you **have to update all used packages in one go**, for example:

`npm install cerebral@next @cerebral/router@next @cerebral/http@next --save --save-exact`

## Contribute
The entire Cerebral codebase has been rewritten to encourage contributions. The code is cleaned up, commented and all code is in a "monorepo". That means you can run tests across projects and general management of the code is simplified a lot.

1. Clone the monorepo: `git clone https://github.com/cerebral/cerebral.git`
2. In root: `npm install`
3. Run `npm run setup:packages` which will build packages source code and link it together
4. Run `npm run setup` if you need to set up whole repo (docs, demos, tutorials, debuggers)

The packages are located under `packages` folder and there is **no need** to run `npm install` for each package.

### Using monorepo for your own apps
If you want to use Cerebral 2 directly from your cloned repo, you can create a symlink
to the `packages/cerebral` directory into the `node_modules` directory of your app.

If your app and the cerebral monorepo are in the same folder you can do from inside your
app directory:

```sh
$ ln -s ../../cerebral/packages/cerebral/ node_modules/
```

Similar you can link other packages from the `packages` directory into your app's
`node_modules` folder.

Just remember to unlink the package before installing it from npm:

```sh
$ unlink node_modules/cerebral
```

### Running demos
Go to the respective `demos/some-demo-folder` and run `npm start`

### Testing
You can run all tests in all packages from root:

`npm test`

Or you can run tests for specific packages by going to package root and do the same:

`npm test`

### Changing the code
When you make a code change you should create a branch first. When the code is changed and backed up by a test you can commit it from **the root** using:

`npm run commit`

This will give you a guide to creating a commit message. Then you just push and create a pull request as normal on Github.

[npm-image]: https://img.shields.io/npm/v/cerebral.svg?style=flat
[npm-url]: https://npmjs.org/package/cerebral
[travis-image]: https://img.shields.io/travis/cerebral/cerebral.svg?style=flat
[travis-url]: https://travis-ci.org/cerebral/cerebral
[codecov-image]: https://img.shields.io/codecov/c/github/cerebral/cerebral/master.svg?maxAge=2592000?style=flat-square
[codecov-url]: https://codecov.io/gh/cerebral/cerebral
[bithound-image]: https://www.bithound.io/github/cerebral/cerebral/badges/score.svg
[bithound-url]: https://www.bithound.io/github/cerebral/cerebral
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[discord-image]: https://img.shields.io/badge/discord-join%20chat-blue.svg
[discord-url]: https://discord.gg/0kIweV4bd2bwwsvH
