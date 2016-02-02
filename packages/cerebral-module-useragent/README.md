# cerebral-module-useragent

A Cerebral module for everything user agent.

- Window size & orientation
- Browser, device & OS detection
- Media queries (comming soon)
- Feature detection (comming soon)

## Install

```
npm install --save cerebral-module-useragent
```

## Usage

```javascript
import controller from './controller'
import Useragent form 'cerebral-module-useragent'

const useragent = Useragent()

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
    }
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

Those are the defaults. You can selectively disable any of these features.
