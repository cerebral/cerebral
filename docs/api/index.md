# Controller

```js
import {Controller} from 'cerebral'

const controller = Controller({
  // Defines the top level state
  state: {},

  // Defines the top level signals
  signals: {},

  // Defines the top level modules
  modules: {}
})

export default controller
```

## Errors
Cerebral knows about any errors that happen during a signal execution, synchronous and asynchronous. Cerebral throws these errors to the console, but you can intercept this if you want to pass errors to tracking services etc. The error will be thrown to console after your error handler(s) has run.

```js
controller.on('error', function (error, execution, functionDetails) {})
```

## Methods

### getState(path)
Returns state from the state tree

```js
const someState = controller.getState('some.state')
```

### getSignal(path)
Returns signal from Cerebral

```js
const someSignal = controller.getSignal('some.signal')
// Run signal
someSignal({foo: 'bar'})
```

### getModel()
Returns the model (state tree) of Cerebral

```js
const model = controller.getModel()
```

### flush(force)
Flushes out changes to UI based on recent state changes, can be forced

```js
controller.flush()
```

### runSignal(name, definition, payload)
Allows you to run an arbitrary function tree definition

```js
controller.runSignal('someSignal', [actionA, actionB], {foo: 'bar'})
```

### addModule(path, module)
Allows you to add modules to the controller after instantiation (lazy)

```js
controller.addModule('someModule', module)
```

### removeModule(path, module)
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
