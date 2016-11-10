---
title: From 1.x to 2.x
---

## From 1.x to 2.x

To migrate from 1.x to 2.x you need to take the following under consideration.

- There are no models left to choose from. Cerebral comes with one model.
- Services is removed in favor of function-tree/providers

### Controller
Instead of choosing your model and connect to the *Controller* as in 1.x as shown below

```js
import {Controller} from 'cerebral'
import Model from 'cerebral/models/immutable'

const controller = Controller(Model({
  // You can add some initial state here if you want
}))

export default controller
```

You would simple do the following in 2.x

```js
import {Controller} from 'cerebral'

const controller = Controller({
  // You can add some initial state here if you want
})

export default controller
```

### Modules
In 1.x you would have done something like this.

```js
import {Controller} from 'cerebral'
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

In 2.x it's a simpler process.

```js
import {Controller} from 'cerebral'

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

### Signals
You handle signals mostly the same way as in 1.x. You can describe signals in a module or in the controller directly.

#### 1.x
```js
import {Controller} from 'cerebral'
import Model from 'cerebral-model-immutable'
import doSomething from './chains/doSomething'

const controller = Controller(Model({}))

controller.addSignals({
  buttonClicked: doSomething
})
```
#### 2.x
```js
import {Controller} from 'cerebral'
import doSomething from './chains/doSomething'

const controller = Controller({
  signals: {
    buttonClicked: doSomething
  }
})
```

One note when using signals is that the **immediate** option is gone. This keeps the api cleaner.

### Actions
Since cerebral 2.x is using **function-tree** under the hood we have other, more powerful options then before. The input, state is the same but output is gone. You can just return an object from the action that will be available in the input for the next action. You can also return a **path** that is a new concept in Cerebral 2.x and outdates output. **path** is used to determine the execution path for your chain. You do no longer have services as an argument in the context put rather providers instead.

#### 1.x
```js
function myAction({input, state, output, services}) {

}
```

In 2.x you have the following. Instead of services you hook up providers that superseeds services.

```js
function myAction({input, state, path}) {

}
```

When you wanted to output to paths in 1.x you would do something like this.
```js
function myAction({state, output}) {
  if (state.get('app.isAwesome')) {
    output.awesome()
  } else {
    output.notSoAwesome()
  }
}
myAction.outputs = ['awesome', 'notSoAwesome']
```

With the new **path** concept this is simpler. In 2.x you would just do what is stated below. Please note the **return path...**.

```js
function myAction({state, path}) {
  if (state.get('app.isAwesome')) {
    return path.awesome()
  } else {
    return path.notSoAwesome()
  }
}
```

If you don't want to take another path in the execution tree you could return a new object that would be available in the input object.

```js
function myAction({state, path}) {
  return {
    someData: 'Some new data available at output.someData'
  }
}
```

When doing async operations you would do something like this in 1.x

```js
function myAction({services}) {
  // do something async
}

myAction.async = true

```

In Cerebral 2 you can leave that out and just resolve or reject a promise.

In 1.x you could set a path that wasn't defined yet in the state tree. Let's say your state looked like this.

```js
{
  app: {
    nodes: {}
  }
}
```

You could do this in an action.

```js
function myAction({state}) {
  state.set('app.nodes.some.state.more', {updated: true})
}
```

With 2.x this is no longer possible. It's easy to mistype paths and therefore this option is no longer available. Your paths need to be in place before setting values to them.

When using computed data in an action you could call **state.computed(myComputed())** in the action. This has changed in 2.x in favor of
**state.compute(myComputed)**. You can also pass props to the compute function.

```js
function myAction({state}) {
  state.compute(someComputed)
  state.compute(someComputed.props({foo: 'bar'})
}
```

This works the same in context for 2.x

```js
connect({
  foo: someComputed,
  foo2: someComputed.props({foo: 'bar'})
})
```

### Providers (outdates services)

In 1.x you could add services that would be available to you in the actions. Typically you would do something like this in 1.x

```js
import someExternalApi from 'some-external-api'

export default (options = {}) => module => {

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
import {Controller} from 'cerebral'
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

Now instead of having services in the context object in an action you would have the **axios** object.

```js
function myAction({axios}) {

}
```

### Views
How you import view specific packages has changed. In 1.x you would import Container like this.

```js
import controller from './controller.js'
import React from 'react'
import {render} from 'react-dom'
import {Container} from 'cerebral-view-react'

// Your main application component
import App from './components/App'

render(
  <Container controller={controller}>
    <App/>
  </Container>
, document.querySelector('#app'))
```

In 2.x you would not import the Container from another package.

```js
import controller from './controller.js'
import React from 'react'
import {render} from 'react-dom'
import {Container} from 'cerebral/react'

// Your main application component
import App from './components/App'

render(
  <Container controller={controller}>
    <App/>
  </Container>
, document.querySelector('#app'))
```

The same is true when connecting Cerebral to your component. In 1.x you would import it like this.

```js
import React from 'react';
import {connect} from 'cerebral-view-react';

export default connect({
  isLoading: 'app.isLoading'
},
  function App(props) {
    return (
      <div>
        {props.isLoading ? 'loading...' : null}
      </div>
    )
  }
)
```

In 2.x you would have to use a different import.

```js
import React from 'react';
import {connect} from 'cerebral/react';

export default connect({
  isLoading: 'app.isLoading'
},
  function App(props) {
    return (
      <div>
        {props.isLoading ? 'loading...' : null}
      </div>
    )
  }
)
```

### Strict render mode
To setup strict render mode in 1.x for React was specified as follows.

```js
render(
  <Container controller={controller} strict>
    <App/>
  </Container>
, document.querySelector('#app'))
```

In 2.x you need to specify this in the controller

```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  strictRender: true
})

export default controller
```

### Devtools
The devtools has changed as well. Go to chrome store and install cerebral2 debugger. The setup has slightly changed from 1.x to 2.x as well as the import.

#### 1.x
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

#### 2.x
```js
import Controller from 'cerebral'
import Devtools from 'cerebra/devtools'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? () => {} : Devtools(),
  modules: {
    ...
  }
})

export default controller
```
