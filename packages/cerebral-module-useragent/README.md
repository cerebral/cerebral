# cerebral-module-useragent

A Cerebral module for everything user agent.

[![NPM version][npm-image]][npm-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]
[![js-standard-style][standard-image]][standard-url]
[![Discord][discord-image]][discord-url]

## Concept
The useragent module puts information about the browser into your model, and it also updates this information when the size of the browser changes etc.

- UA parser: browser and device
- Window: size & orientation
- Media queries
- Feature detection
- Internet connectivity

### Install
`npm install cerebral-module-useragent --save`

### Setup
```js
import {Controller} from 'cerebral'
import Useragent from 'cerebral-module-useragent'

const controller = Controller({
  modules: {
    useragent: Useragent({
      // Use CSS media queries to determine
      // custom sizes available in your model.
      // They will be toggle between true/false in your
      // model
      media: {
        small: '(min-width: 600px)',
        medium: '(min-width: 1024px)',
        large: '(min-width: 1440px)',
        portrait: '(orientation: portrait)'
      },

      // store all feature tests in model
      feature: true,

      parse: {
        // parse useragent.browser from ua string
        browser: true,
        // parse useragent.device from ua string
        device: true
      },

      // check the docs at: https://github.com/HubSpot/offline#advanced
      offline: {
        checkOnLoad: false,
        interceptRequests: true,
        reconnect: {
          initialDelay: 3,
          delay: 1.5
        },
        requests: false
      },

      // update window size on resize
      window: true
    })
  }
})
```

### Grabbing details from useragent
The useragent module will populate your model on the given namespace. All you need to do in your view layer is to grab whatever data you need from it, for example media:

```javascript
export default connect({
  media: 'useragent.media.*'
}, ...)
```

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
