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
  small: '(min-width: 600px)',
  medium: '(min-width: 1024px)',
  large: '(min-width: 1440px)',
  portrait: '(orientation: portrait)'
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
  }
}
```

## Options

```javascript
import controller from './controller'
import Useragent form 'cerebral-module-useragent'

const useragent = Useragent({
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
