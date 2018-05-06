# Structure

You can structure your application however you want, but there is a recommended approach based on common experiences building Cerebral applications.

## File structure

```js
src/
  app/
    modules/
      ...
    actions.js
    factories.js
    sequences.js
    errors.js
    index.js
  controller.js
```

This structure favors a single file for each type of composable component of a signal. The root module is named **app** and will hold submodules in the **modules** folder.

## Actions

```js
import { state } from 'cerebral/proxy'

export function actionA({ mutation }) {
  mutation.set(state.foo, 'bar')
}

export function actionB({ mutation }) {
  mutation.set(state.foo, 'bar')
}
```

You export multiple actions from each modules _actions.js_ file.

If you prefer arrow functions, you can write:

```js
import { state } from 'cerebral/proxy'

export const actionA = ({ mutation }) => mutation.set(state.foo, 'bar')

export const actionB = ({ mutation }) => mutation.set(path.foo, 'bar')
```

### Factories

Factories are similar to actions:

```js
// Normal function
export function setLoadingApp (isLoading) {
  return function setLoadingApp({ mutation }) {
    mutation.set(state.isLoading, isLoading)
  }
}

// Arrow function
// We return a named function for debugging purposes
export const setLoadingApp = (isLoading) =>
  function setLoadingApp({ mutation }) {
    mutation.set(state.isLoading, isLoading)
  }
```

### Sequences

You import all actions and factories into the _sequences.js_ file. This will give you autosuggestions on available actions and factories. You can combine this with operators:

```js
import { set } from 'cerebral/operators'
import { state } from 'cerebral/proxy'
import * as actions from './actions'
import * as factories from './factories'

export const initialize = [
  factories.setLoadingApp(true),
  actions.getUser,
  actions.setUser,
  set(state.isLoading, false)
]
```

### Modules

You import all your sequences into the modules file, attaching them to the signals definition.

```js
import { Module } from 'cerebral'
import * as signals from './sequences'
import * as errors from './errors'

export default Module({
  state: {
    isLoading: false
  },
  signals,
  catch: [[errors.AuthError, sequences.catchAuthError]]
})
```
