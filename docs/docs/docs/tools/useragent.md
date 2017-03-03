# cerebral-module-useragent

## install
`npm install cerebral-module-useragent`

## description
The useragent module puts information about the browser into your state tree, and it also updates this information when this information changes.

- UA parser: browser and device
- Window: size & orientation
- Media queries
- Feature detection
- Internet connectivity

## instantiate

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
