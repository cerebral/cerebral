---
title: Controller
---

## Controller

```js
import {Controller} from 'cerebral'

const controller = Controller({
  options: {
    // Use strict rendering
    strictRender: false,
    // Expose props.signals with all signals in components
    signalsProp: false
  },
  // Defines the top level state
  state: {},
  // Defines the top level signals
  signals: {},
  // Defines the top level modules
  modules: {}
})
```
