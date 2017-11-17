# Patterns

## Declarative for the win

### File structure
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

This pattern favors a single file for each type of composable component of a signal. This allows you to create less files and less import statements, though the individual files will have multiple definitions.

### Actions
```js
export function actionA ({ state }) {
  state.set('foo', 'bar')
}

export function actionB ({ state }) {
  state.set('foo', 'bar')
}
```

You export multiple actions from each modules *actions.js* file. You will create an action or a factory for every single piece of logic. This will make your sequences more declarative, though you will need to write more custom logic.

If you prefer arrow functions, you can write:

```js
export const actionA = ({ state }) => state.set('foo', 'bar')

export const actionB = ({ state }) => state.set('foo', 'bar')
```

### Factories

Factories are similar to actions:

```js
// Normal function
export function setLoadingApp (isLoading) {
  return function setLoadingApp({ state }) {
    state.set('isLoading', isLoading)
  }
}

// Arrow function
export const setLoadingApp = (isLoading) => function setLoadingApp({ state }) {
  state.set('isLoading', isLoading)
}
```

### Sequences

You import all actions and factories into the *sequences.js* file. This will give you autosuggestions on available actions and factories. Notice in this pattern that all sequence logic is fully declarative.

```js
import * as actions from './actions'
import * as factories from './factories'

export const initialize = [
  factories.setLoadingApp(true),
  actions.getUser,
  actions.setUser,
  factories.setLoadingApp(false),
]
```

### Modules

You import all your sequences into the modules file, attaching them to the signals definition.

```js
import { Module } from 'cerebral'
import * as sequences from './sequences'
import * as errors from './errors'

export default Module({
  state: {
    isLoading: false
  },
  signals: {
    initialized: sequences.initialize
  },
  catch: [
    [errors.AuthError, sequences.catchAuthError]
  ]
})
```

## Clean and easy

The *"Declarative for the win"* pattern does not include the operators of Cerebral. The reason is that operators has a cost. The cost is less declarative code in favor of less action implementations. That said operators are still declarative and it ends up being a preference choice. Also the previous pattern puts multiple definitions into one file, you might prefer separating them.

### File structure
```js
src/
  app/
    modules/
    actions/
    factories/
    sequences/
    errors.js
    index.js
  controller.js
```

### Actions
Each action is put into its own file.

```js
function actionA ({ state }) {
  state.set('foo', 'bar')
}

export default actionA
```

### Factories

Factories are similar to actions:

```js
function setLoadingAppFactory (isLoading) {
  return function setLoadingApp({ state }) {
    state.set('isLoading', isLoading)
  }
}

export default setLoadingAppFactory
```

### Sequences

You import individual actions and factories into the sequence file and combine them with operators.

```js
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/tags'
import getUser from '../actions/getUser'

export const initialize = [
  set(state`isLoading`, true),
  getUser,
  set(state`user`, props`user`),
  set(state`isLoading`, false)
]
```

### Modules

You import all your sequences into the modules file, attaching them to the signals definition.

```js
import { Module } from 'cerebral'
import * as sequences from './sequences'
import * as errors from './errors'

export default Module({
  state: {
    isLoading: false
  },
  signals: {
    initialized: sequences.initialize
  },
  catch: [
    [errors.AuthError, sequences.catchAuthError]
  ]
})
```
