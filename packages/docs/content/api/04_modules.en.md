---
title: Modules
---

## Modules

A module is basically an object. Modules helps you structure your state and signals. You can think of them as namespaces for state and signals.

```js
export default {
  // Define module state, namespaced by module path
  state: {},
  // Define module signals, namespaced by module path
  signals: {},
  // Define submodules, namespaced by module path
  modules: {}
}
```

It is also possible to define a module using a function.

```js
export default (module) => {
  module.name // Name of module
  module.path // Full path to module
  module.controller // The controller the module is attached to

  return {
    state: {},
    signals: {},
    moduleS: {}
  }
}
```

You attach a module simply by referencing it:

```js
import {Controller} from 'cerebral'
import FeedModule from './modules/Feed'

const controller = Controller({
  modules: {
    feed: FeedModule
  }
})
```
