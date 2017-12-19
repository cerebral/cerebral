# Module
*since version 4.0*

Modules are the core building blocks of your application. This is where you define state, signals, submodules etc.

# Module object

```js
import { Module } from 'cerebral'

export default Module({
  // Define module state, namespaced by module path
  state: {},
  // Define module signals, namespaced by module path
  signals: {},
  // Define submodules, namespaced by module path
  modules: {},
  // Add a global providers when module instantiates
  providers: {},
  // Add error catchers
  catch: []
})
```

You add the root module to the controller:

```js
import { Controller } from 'cerebral'
import app from './app'

export default Controller(app)
```

# Module function
It is also possible to define a module using a function.

```js
import { Module } from 'cerebral'

export default Module((module) => {
  module.name // Name of module
  module.path // Full path to module
  module.controller // The controller the module is attached to

  return {
    state: {},
    signals: {},
    modules: {},
    providers: {},
    catch: []
  }
})
```


# Module factory
With the use of a factory it is possible to make reusable modules.

```js
import { Module } from 'cerebral'

export default (options) => {
  return Module({
    state: {
      location: options.of
    }
  })
}
```

You then configure the module when you attach it:

```js
import { Controller } from 'cerebral'
import Location from './modules/Location'

const controller = Controller({
  modules: {
    location1: Location({of: 'Europe'}),
    location2: Location({of: 'Africa'})
  }
})
```
