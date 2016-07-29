# cerebral-module-useragent

A Cerebral module for everything user agent.

[![NPM version][npm-image]][npm-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]
[![js-standard-style][standard-image]][standard-url]
[![Discord][discord-image]][discord-url]

# cerebral-view-react
React view package for Cerebral

### How to use
Go to [http://www.cerebraljs.com/documentation/cerebral-module-useragent](http://www.cerebraljs.com/documentation/cerebral-module-useragent)

## User agent parser

I am using the [ua-parser-js](https://www.npmjs.com/package/ua-parser-js) package to parse `navigator.userAgent`. Currently only the browser, device and OS parts are stored in the model, because I didn't see any use for cpu and engine.

## Window

The window resize event is just slightly throttled using `requestAnimationFrame()`. I might make this configurable to use a stronger throttle timeout if it proofs to be too resource hungry.

## Media queries

The media queries are tested with `matchMedia()` so you should be able to use any valid CSS media query.

## Feature detection

I am using the [feature.js](https://www.npmjs.com/package/feature.js) package to detect browser features. Please checkout the website to see a list of all supported feature tests.

You can also only store certain test results in the model or define your own tests.

```javascript
const useragent = Useragent({
  feature: {
    touch: true,
    serviceWorker: true,
    getUserMedia: () => !!navigator.getUserMedia
  }
})
```
> All tests from `feature.js` are executed even if you set the feature option to false. This is a limitation of the library.

## Network detection

I am using the [offline-js](https://www.npmjs.com/package/offline-js) package to detect internet connectivity. The application is initially assumed to be online.

## Contribute

Fork repo

- `npm install`
- `cd demo` and `npm install`
- `npm start` runs the demo which is currently used for testing
- `npm lint` lint with [JavaScript Standard Style](http://standardjs.com)
- `npm run build` compiles es6 to es5

No tests yet. Feel free to issue a pull request if you want this.

[npm-image]: https://img.shields.io/npm/v/cerebral-module-useragent.svg?style=flat
[npm-url]: https://npmjs.org/package/cerebral-module-useragent
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[discord-image]: https://img.shields.io/badge/discord-join%20chat-blue.svg
[discord-url]: https://discord.gg/0kIweV4bd2bwwsvH
