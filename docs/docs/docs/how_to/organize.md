# Organize

Cerebral uses a concept called **modules** to organize application code. These allow you to wrap state and signals into a namespace without isolating them. Any action run in a signal can change any state in the application.

Typically the file structure for modules looks like this. We call it the **signals pattern**. Every signal has its own file.

```js
/modules
  /home
    /actions
    /signals
    index.js
main.js
```

The **index.js** file is where you define the module. It is just an object where you can define state, signals and optionally sub modules.

```js
import somethingHappened from './signals/somethingHappened'

export default {
  state: {},
  signals: {
    somethingHappened
  }
}
```

You might rather want to follow the **chains** pattern, which looks like this:

```js
/modules
  /home
    /actions
    /chains
    index.js
main.js
```

```js
import doThis from './chains/doThis'

export default {
  signals: {
    somethingHappened: doThis
  }
}
```

In this case you rather composes your signals together inside the module definition.


In the **main.js** file, the module is added to the controller:

```js
import {Controller} from 'cerebral'
import home from './modules/home'

const controller = Controller({
  modules: {
    home
  }
})
```

Any signal and state defined inside the *home* module will live on the namespace chosen during controller instantiation.

And this is how an application scales: by defining modules and submodules. Actions or chains that are common are often placed in a folder called **common**:

```js
/common
  /actions
  /chains
/modules
  /home
    /actions
    /chains
    index.js
main.js
```

## Components

A very important point in Cerebral is that your components do not affect the structure of the application state. Modules are defined in terms of what makes sense for state and signals. Sometimes this is similar to how components are structured, but more often it is not. This is why components usually live in their own **components** folder, separated from the modules:

```js
/components
  /Home
    index.js
/common
  /actions
  /chains
/modules
  /home
    /actions
    /chains
    index.js
main.js
```

And this is it. You will never get in trouble creating a module because any action can change any state in your application. Modules are just a way to structure state and signals, not isolate them.
