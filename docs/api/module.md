# Module

Modules help you structure your state and signals into logical units. You can think of them as namespaces for state and signals.

# Module object

```js
export default {
  // Define module state, namespaced by module path
  state: {},
  // Define module signals, namespaced by module path
  signals: {},
  // Define submodules, namespaced by module path
  modules: {},
  // Add a global provider when module instantiates
  provider(context, functionDetails, payload) {}
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

# Module function
It is also possible to define a module using a function.

```js
export default (module) => {
  module.name // Name of module
  module.path // Full path to module
  module.controller // The controller the module is attached to

  return {
    state: {},
    signals: {},
    modules: {},
    provider(context, functionDetails, payload) {}
  }
}
```


# Module factory
With the use of a factory it is possible to make reusable modules.

```js
export default (options) =>  {
  return {
    state: {
      location: options.of
    }
  }
}
```

You then configure the module when you attach it:

```js
import {Controller} from 'cerebral'
import Location from './modules/Location'

const controller = Controller({
  modules: {
    location1: Location({of: 'Europe'}),
    location2: Location({of: 'Africa'})
  }
})
```
