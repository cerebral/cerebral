# Module

Modules are the structural building blocks of your application. This is where you define state, sequences, submodules etc.

# Module object

```js
import { Module } from 'cerebral'

export default Module({
  // Define module state, namespaced by module path
  state: {},
  // Define module sequences, namespaced by module path
  sequences: {},
  // Define submodules, namespaced by module path
  modules: {},
  // Define reactions, namespaced by module path
  reactions: {},
  // Add a global providers when module instantiates
  providers: {},
  // Add error catchers
  catch: []
})
```

You add the root module to the app:

```js
import App from 'cerebral'
import main from './main'

const app = App(main)
```

# Module function

It is also possible to define a module using a function.

```js
import { Module } from 'cerebral'

export default Module((module) => {
  module.name // Name of module
  module.path // Full path to module
  module.app // The app the module is attached to

  return {
    state: {},
    sequences: {},
    modules: {},
    reactions: {},
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
import App from 'cerebral'
import Location from './modules/Location'

const app = App({
  modules: {
    location1: Location({ of: 'Europe' }),
    location2: Location({ of: 'Africa' })
  }
})
```
