# Cerebral
A state controller with its own debugger

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![bitHound Score][bithound-image]][bithound-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
[![Discord][discord-image]][discord-url]
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors)
<img src="images/logo.png" width="300" align="center">

## Documentation

* [Cerebral v1 documentation website](http://cerebral-website.herokuapp.com/)
* [Cerebral v2 beta documentation website](http://www.cerebraljs.com/)

## Try out Cerebral 2
To try out Cerebral 2 you can install any package with:

`npm install {cerebralPackage}@beta --save`

For packages which are scoped with `@cerebral/` `@beta` can be omitted.

This will install the latest version of that package. New versions are automatically deployed whenever pull requests are merged into master.

## Contribute
The entire Cerebral codebase has been rewritten to encourage contributions. The code is cleaned up, commented and all code is in a "monorepo". That means you can run tests across projects and general management of the code is simplified a lot.

1. Clone the monorepo: `git clone https://github.com/cerebral/cerebral.git`
2. In root: `npm install`

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

[npm-image]: https://img.shields.io/npm/v/cerebral.svg?style=flat
[npm-url]: https://npmjs.org/package/cerebral
[travis-image]: https://img.shields.io/travis/cerebral/cerebral.svg?style=flat
[travis-url]: https://travis-ci.org/cerebral/cerebral
[coverage-image]: https://coveralls.io/repos/github/cerebral/cerebral/badge.svg
[coverage-url]: https://coveralls.io/github/cerebral/cerebral
[bithound-image]: https://www.bithound.io/github/cerebral/cerebral/badges/score.svg
[bithound-url]: https://www.bithound.io/github/cerebral/cerebral
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[discord-image]: https://img.shields.io/badge/discord-join%20chat-blue.svg
[discord-url]: https://discord.gg/0kIweV4bd2bwwsvH

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars2.githubusercontent.com/u/3956929?v=3" width="100px;"/><br /><sub>Christian Alfoni</sub>](http://www.christianalfoni.com)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=christianalfoni "Code") [📖](https://github.com/christianalfoni/cerebral/commits?author=christianalfoni "Documentation") [✅](#tutorial-christianalfoni "Tutorials") [📝](#blog-christianalfoni "Blogposts") [🔧](#tool-christianalfoni "Tools") | [<img src="https://avatars2.githubusercontent.com/u/36270?v=3" width="100px;"/><br /><sub>Aleksey Guryanov</sub>](http://twitter.com/GuriaFS)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=Guria "Code") [🚇](#infra-Guria "Infrastructure (Hosting, Build-Tools, etc)") [🔧](#tool-Guria "Tools") | [<img src="https://avatars0.githubusercontent.com/u/7619824?v=3" width="100px;"/><br /><sub>Henri Hulski</sub>](http://openhomeo.info)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=henri-hulski "Code") [🚇](#infra-henri-hulski "Infrastructure (Hosting, Build-Tools, etc)") [🔧](#tool-henri-hulski "Tools") | [<img src="https://avatars3.githubusercontent.com/u/21707?v=3" width="100px;"/><br /><sub>Gaspard Bucher</sub>](http://feature-space.com)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=gaspard "Code") [🚇](#infra-gaspard "Infrastructure (Hosting, Build-Tools, etc)") [🔧](#tool-gaspard "Tools") | [<img src="https://avatars2.githubusercontent.com/u/6061720?v=3" width="100px;"/><br /><sub>Mathias Nilsson</sub>](http://www.edgesoft.se)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=edgesoft "Code") [⚠️](https://github.com/christianalfoni/cerebral/commits?author=edgesoft "Tests") | [<img src="https://avatars2.githubusercontent.com/u/109876?v=3" width="100px;"/><br /><sub>Eli Yukelzon</sub>](https://github.com/reflog)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=reflog "Code") [⚠️](https://github.com/christianalfoni/cerebral/commits?author=reflog "Tests") [✅](#tutorial-reflog "Tutorials") | [<img src="https://avatars0.githubusercontent.com/u/747214?v=3" width="100px;"/><br /><sub>yusufsafak</sub>](https://github.com/yusufsafak)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=yusufsafak "Code") [⚠️](https://github.com/christianalfoni/cerebral/commits?author=yusufsafak "Tests") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars2.githubusercontent.com/u/11060313?v=3" width="100px;"/><br /><sub>maxfrigge</sub>](https://github.com/maxfrigge)<br />[📖](https://github.com/christianalfoni/cerebral/commits?author=maxfrigge "Documentation") [⚠️](https://github.com/christianalfoni/cerebral/commits?author=maxfrigge "Tests") | [<img src="https://avatars0.githubusercontent.com/u/5448300?v=3" width="100px;"/><br /><sub>Philipp Knecht</sub>](http://www.itflies.ch)<br />[📖](https://github.com/christianalfoni/cerebral/commits?author=fopsdev "Documentation") [⚠️](https://github.com/christianalfoni/cerebral/commits?author=fopsdev "Tests") | [<img src="https://avatars0.githubusercontent.com/u/4643?v=3" width="100px;"/><br /><sub>Garth Williams</sub>](http://wi.llia.ms)<br />[💻](https://github.com/christianalfoni/cerebral/commits?author=garth "Code") [📖](https://github.com/christianalfoni/cerebral/commits?author=garth "Documentation") [⚠️](https://github.com/christianalfoni/cerebral/commits?author=garth "Tests") | [<img src="https://avatars0.githubusercontent.com/u/620722?v=3" width="100px;"/><br /><sub>Michael Plotke</sub>](https://github.com/bdjnk)<br />[📖](https://github.com/christianalfoni/cerebral/commits?author=bdjnk "Documentation") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!