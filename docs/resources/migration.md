# Migration

When migrating from 1.x to 2.x you need to take the following under consideration.

* There are no models left to choose from. Cerebral now comes with one model.
* Services have been removed in favor of function-tree/providers.

## Controller

Instead of choosing your model and connecting to the _Controller_ as in 1.x as shown below

```js
import { Controller } from 'cerebral'
import Model from 'cerebral/models/immutable'

const controller = Controller(
  Model({
    // You can add some initial state here if you want
  })
)

export default controller
```

You would simply do the following in 2.x

```js
import { Controller } from 'cerebral'

const controller = Controller({
  state: {
    // You can add some initial state here if you want
  }
})

export default controller
```

**controller.getSignals()** is removed from 2.x so favor **controller.getSignal('some.signal')** instead.

## Modules

In 1.x you would have done something like this

```js
import { Controller } from 'cerebral'
import Model from 'cerebral/models/immutable'

import Home from './modules/Home'
import Admin from './modules/Admin'

const controller = Controller(Model({}))

controller.addModules({
  home: Home,
  admin: Admin
})

export default controller
```

In 2.x the modules are defined along with the controller

```js
import { Controller } from 'cerebral'

import Home from './modules/Home'
import Admin from './modules/Admin'

const controller = Controller({
  modules: {
    home: Home(),
    admin: Admin()
  }
})

export default controller
```

Sub-modules can be defined by each module in the same way (see below).

In 1.x you would create your own module like this

```js
// 1.x
export default (module) => {
  module.addState({
    items: [],
    newItemTitle: '',
    isSaving: false,
    error: null
  })

  module.addSignals({
    newItemTitleSubmitted: submitNewItemTitle
  })
}
```

addState, addSignals have been removed, so in 2.x you simply return an object

```js
// 2.x
export default {
  state: {
    items: [],
    newItemTitle: '',
    isSaving: false,
    error: null
  },
  modules: {
    subModule: SubModule()
  },
  signals: {
    newItemTitleSubmitted: submitNewItemTitle
  }
}
```

## Operators

The biggest change to Cerebral 2.x is the operators. You can read more about them in the Operators docs. They have become very powerful and you can create your own operators. Operators in Cerebral 2.x has been moved into core Cerebral. You can still use the old operators if you want by installing them via npm.

```js
npm install cerebral-operators
```

The new operators now use tagged template literals and you can reduce number of actions and instead use the new operators. Here is a quick sample. As you can see you import them from 'cerebral/operators'

```js
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/tags'

export default [set(state`foo.bar`, props`bar`)]
```

Other operators include: wait, when, equals, debounce, push, pop, shift, toggle, unset, splice

## Signals

You handle signals mostly the same way as in 1.x. You can describe signals in a module or in the controller directly.

### 1.x

```js
import { Controller } from 'cerebral'
import Model from 'cerebral-model-immutable'
import doSomething from './chains/doSomething'
import updateField from './chains/updateField'

const controller = Controller(Model({}))

controller.addSignals({
  buttonClicked: doSomething,
  fieldChanged: { immediate: true, chain: updateField }
})
```

### 2.x

```js
import { Controller } from 'cerebral'
import doSomething from './chains/doSomething'
import updateField from './chains/updateField'

const controller = Controller({
  signals: {
    buttonClicked: doSomething,
    fieldChanged: updateField
  }
})
```

One note when using signals is that the **immediate** option is gone. This keeps the api cleaner.

## Actions

Since cerebral 2.x is using **function-tree** under the hood we have other, more powerful options than before. The state is the same, but output is gone and input is renamed to props. You can just return an object from the action that will be available in the props for the next action. You can also return a **path** that is a new concept in Cerebral 2.x and outdates output. **path** is used to determine the execution path for your chain. You do no longer have services as an argument in the context, use providers instead.

### 1.x

```js
function myAction({ props, state, output, services }) {}
```

In 2.x you have the following. Instead of services you hook up providers that supersedes services.

```js
function myAction({ props, state, path /*, myProvider, otherProvider */ }) {}
```

When you wanted to output to paths in 1.x you would do something like this

```js
function myAction({ state, output }) {
  if (state.get('app.isAwesome')) {
    output.awesome()
  } else {
    output.notSoAwesome()
  }
}
myAction.outputs = ['awesome', 'notSoAwesome']
```

With the new **path** concept this is simpler. In 2.x you would just do what is stated below. Please note the **return path...**. The same is true with promises. They need to be returned.

```js
function myAction({ state, path }) {
  if (state.get('app.isAwesome')) {
    return path.awesome()
  } else {
    return path.notSoAwesome()
  }
}
```

If you don't want to take another path in the execution tree you could return a new object that would be available in the props object.

```js
function myAction({ state, path }) {
  return {
    someData: 'Some new data available at output.someData'
  }
}
```

When doing async operations you would do something like this in 1.x

```js
function myAction({ output }) {
  setTimeout(() => {
    output({
      /* optional output */
    }) // or output.pathName({ /* optional output */ })
  }, 1000)
}

myAction.async = true
```

In Cerebral 2 you you must resolve or reject a returned promise.

```js
function myAction({ path }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        /* optional output */
      }) // or resolve(path.pathName({ /* optional output */ }))
    }, 1000)
  })
}
```

In 1.x you could set a path that wasn't defined yet in the state tree. Let's say your state looked like this.

```js
{
  app: {
    nodes: {
    }
  }
}
```

You could do this in an action.

```js
function myAction({ state }) {
  state.set('app.nodes.some.state.more', { updated: true })
}
```

With 2.x this is no longer possible. It's easy to mistype paths and therefore this option is no longer available. Your paths need to be in place before setting values to them.

When using computed data in an action you could call **state.computed(myComputed())** in the action. This has changed in 2.x in favor of
**state.compute(myComputed)**. You can also pass props to the compute function.

```js
function myAction({ state }) {
  state.compute(someComputed)
  state.compute(someComputed.props({ foo: 'bar' }))
}
```

This works the same in context for 2.x

```js
connect({
  foo: someComputed,
  foo2: someComputedFactory({ foo: 'bar' })
})
```

## Providers (outdates services)

In 1.x you could add services that would be available to you in the actions. Typically, you would do something like this in 1.x

```js
import someExternalApi from 'some-external-api'

export default (options = {}) => (module) => {
  if (!options.apiKey) {
    throw new Error('This service needs an apiKey')
  }

  module.addServices({
    connect() {
      return someExternalApi.connect({
        apiKey: options.apiKey
      })
    }
  })
}
```

In 2.x you would use providers instead.

```js
import { Controller } from 'cerebral'
import ContextProvider from 'cerebral/providers/context'
import axios from 'axios'

const controller = Controller({
  providers: [
    ContextProvider({
      axios
    })
  ]
})
```

or manually

```js
import { Controller } from 'cerebral'

const controller = Controller({
  provider(context) {
    context.myProvider = {
      doSomething() {}
    }
    return context
  }
})
```

Now instead of having services in the context object in an action you would have the **axios** object.

```js
function myAction({ axios }) {}
```

## Views

How you import view specific packages has changed. In 1.x you would import Container like this.

```js
import controller from './controller.js'
import React from 'react'
import { render } from 'react-dom'
import { Container } from 'cerebral-view-react'

// Your main application component
import App from './components/App'

render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.querySelector('#app')
)
```

In 2.x you would not import the Container from another package.

```js
import controller from './controller.js'
import React from 'react'
import { render } from 'react-dom'
import { Container } from 'cerebral/react'

// Your main application component
import App from './components/App'

render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.querySelector('#app')
)
```

The same is true when connecting Cerebral to your component. In 1.x you would import it like this.

```js
import React from 'react'
import { connect } from 'cerebral-view-react'

export default connect(
  {
    isLoading: 'app.isLoading'
  },
  function App(props) {
    return <div>{props.isLoading ? 'loading...' : null}</div>
  }
)
```

In 2.x you would have to use a different import.

```js
import React from 'react'
import { connect } from 'cerebral/react'
import { state } from 'cerebral/tags'

export default connect(
  {
    isLoading: state`app.isLoading`
  },
  function App(props) {
    return <div>{props.isLoading ? 'loading...' : null}</div>
  }
)
```

In 1.x you would first connect state, then signals as separate arguments in connect. In Cerebral 2.x these are combined, tags are used to differentiate between state, signals and props.

```js
// 2.x
import React from 'react'
import {connect} from 'cerebral/react'
import {props, state, signal} from 'cerebral/tags'

export default connect({
  isLoading: state`app.isLoading`,
  item: state`items.${props`itemId`}`,
  someSignal: signal`app.someSignal`
}.
  function App(props) {
    return (
      <div>
        {props.isLoading ? 'loading...' : null}
      </div>
    )
  }
)
```

If you really want all signals in props as in 1.x you can set this as an option in the controller.

```js
// 2.x
import { Controller } from 'cerebral'
import ContextProvider from 'cerebral/providers/context'
import axios from 'axios'

const controller = Controller({
  options: {
    signalsProp: true
  }
})
```

## Model

The following functions have been removed from Cerebral 2.x when using state inside an action

* logModel
* export
* findWhere
* keys
* import
* toJs
* toJson

## Strict render mode

To setup strict render mode in 1.x for React was specified as follows.

```js
render(
  <Container controller={controller} strict>
    <App />
  </Container>,
  document.querySelector('#app')
)
```

In 2.x this is the only mode

## Devtools

The devtools has changed as well. Go to chrome store and install cerebral2 debugger. The setup has slightly changed from 1.x to 2.x as well as the import.

### 1.x

```js
import Controller from 'cerebral'
import Model from 'cerebral/model/immutable'
import Devtools from 'cerebral-module-devtools'

const controller = Controller(Model({}))

controller.addModules({
  devtools: process.env.NODE_ENV === 'production' ? () => {} : Devtools()
})

export default controller
```

### 2.x

```js
import Controller from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? () => {} : Devtools(),
  modules: {
    ...
  }
})

export default controller
```

## Router

The router now defines its routes with an array

### 1.x

```js
import Controller from 'cerebral'
import Model from 'cerebral/model/immutable'
import Router from 'cerebral-module-router'

const controller = Controller(Model({}))

controller.addModules({
  modules: {
    router: Router({
      routes: {
        '/': 'appRouted'
      }
    })
  }
})

export default controller
```

### 2.x

```js
import Controller from 'cerebral'
import Router from '@cerebral/router'

const controller = Controller({
  modules: {
    router: Router({
      routes: [
        {
          path: '/',
          signal: 'appRouted'
        }
      ]
    })
  }
})

export default controller
```
