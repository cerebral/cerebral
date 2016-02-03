# cerebral-module-useragent

A Cerebral module for everything user agent.

- Window size & orientation
- Browser, device & OS detection
- Media queries
- Feature detection (comming soon)

## Install

```
npm install --save cerebral-module-useragent
```

## Usage

```javascript
import controller from './controller'
import Useragent form 'cerebral-module-useragent'

const useragent = Useragent({
  media: {
    small: '(min-width: 600px)',
    medium: '(min-width: 1024px)',
    large: '(min-width: 1440px)',
    portrait: '(orientation: portrait)'
  }
})

controller.modules({
  useragent
})
```

The module exposes all the user agent information in your state model.

```json
{
  "useragent": {
    "browser": {
      "major": "48",
      "name": "Chrome",
      "version": "48.0.2564.97"
    },
    "device": {
      "model": "",
      "type": "",
      "vendor": ""
    },
    "os": {
      "name": "Mac OS X",
      "version": "10.11.3"
    },
    "window": {
      "width": 1920,
      "height": 1080,
      "orientation": "landscape"
    },
    "media": {
      "small": true,
      "medium": true,
      "large": false,
      "portrait": false
    },
    "feature": {
      "deviceMotion":true,
      "contextMenu":false,
      "serviceWorker":true,
      "touch":false,
      "geolocation":true
    }
  }
}
```

## Options

```javascript
import controller from './controller'
import Useragent form 'cerebral-module-useragent'

const useragent = Useragent({
  feature: true, // store all feature tests in state
  parse: {
    browser: true, // parse useragent.browser from ua string
    device: true, // parse useragent.device from ua string
    os: true  // parse useragent.os from ua string
  },
  window: true // update window size on resize
})

controller.modules({
  useragent
})
```

> Those are the defaults - you can selectively disable any of these features.<br>
> By default there won't be any media queries. You have to define them from scratch.

## User agent parser

I am using the [user-agent-parser](https://www.npmjs.com/package/user-agent-parser) package to parse `navigator.userAgent`. Currently only the browser, device and OS parts are stored in the model, because I didn't see any use for cpu and engine.

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
    touh: true,
    serviceWorker: true,
    getUserMedia: () => !!navigator.getUserMedia
  }
})
```
> All tests from `feature.js` are executed even if you set the feature option to false. This is a limitation of the library.

## Contribute

Fork repo

- `npm install`
- `cd demo` and `npm install`
- `npm start` runs the demo which is currently used for testing

As you can see.. no tests or compilation to es5. 8-)
Feel free to issue a pull request if you want this.
