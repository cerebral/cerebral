# Controller

```js
import {Controller} from 'cerebral'

const controller = Controller({
  // Defines the top level state
  state: {},

  // Defines the top level signals
  signals: {},

  // Defines the top level modules
  modules: {},

  // A map of state changes to run before instantiation,
  // where the key is the path and value is the state value
  stateChanges: {}
})

export default controller
```

## Errors


```js
import {Controller} from 'cerebral'
import {HttpProviderError} from '@cerebral/http'

const controller = Controller({
  catch: new Map([
    [HttpProviderError, someCustomCatchHandlerSequence],
    [Error, someCatchHandlerSequence]
  ])
})

export default controller
```

You can also define a global error handler. This error handler will be called no matter if an error is caught or not. Useful for tracking failures in production.

```js
controller.on('error', (error) => {})
```

## Methods

### getState
Returns state from the state tree

```js
const someState = controller.getState('some.state')
```

### getSignal
Returns signal from Cerebral

```js
const someSignal = controller.getSignal('some.signal')
// Run signal
someSignal({foo: 'bar'})
```

### getModel
Returns the model (state tree) of Cerebral

```js
const model = controller.getModel()
```

### flush
Flushes out changes to UI based on recent state changes, can be forced

```js
controller.flush()
```

### runSignal
Allows you to run an arbitrary function tree definition

```js
controller.runSignal('someSignal', [actionA, actionB], {foo: 'bar'})
```

### addModule
Allows you to add modules to the controller after instantiation (lazy)

```js
controller.addModule('someModule', module)
```

### removeModule
Allows you to remove modules from the controller

```js
controller.removeModule('someModule')
```

## Events

### initialized
Triggers when Cerebral controller has initialized.

```js
controller.on('initialized', () => {})
```

### flush
Triggered whenever Cerebral flushes out changes to the UI. Passes a map of changes.

```js
controller.on('flush', (changes) => {})
```

### start
Triggered whenever Cerebral starts a signal execution.

```js
controller.on('start', (execution, payload) => {})
```

### end
Triggered whenever Cerebral ends a signal execution.

```js
controller.on('end', (execution, payload) => {})
```

### pathStart
Triggered whenever Cerebral starts execution a path in a signal

```js
controller.on('pathStart', (execution, payload) => {})
```

### pathEnd
Triggered whenever Cerebral ends execution a path in a signal

```js
controller.on('pathEnd', (execution, payload) => {})
```

### functionStart
Triggered whenever Cerebral starts executing an action.

```js
controller.on('functionStart', (execution, functionDetails, payload) => {})
```

### functionEnd
Triggered whenever Cerebral ends executing an action.

```js
controller.on('functionEnd', (execution, functionDetails, payload) => {})
```

### asyncFunction
Triggered whenever Cerebral executed an async action.

```js
controller.on('asyncFunction', (execution, functionDetails, payload) => {})
```

### parallelStart
Triggered whenever Cerebral executes actions in parallel.

```js
controller.on('parallelStart', (execution, payload, functionsToResolveCount) => {})
```

### parallelProgress
Triggered whenever Cerebral executes actions in parallel.

```js
controller.on('parallelProgress', (execution, payload, functionsStillResolvingCount) => {})
```

### parallelEnd
Triggered whenever Cerebral ends executing actions in parallel.

```js
controller.on('parallelEnd', (execution, payload, functionsExecutedCount) => {})
```

### remember
Triggered whenever Cerebral travels back in time. Passes the timestamp it travelled to.

```js
controller.on('remember', (datetime) => {})
```
