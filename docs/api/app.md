# App

```js
import App from 'cerebral'
import main from './main' // The main module

const app = App(main, {
  // The devtools
  devtools: null,
  // Also logs error handling to console.
  throwToConsole: true,
  // Prevent rethrow of errors (useful if you already use an on('error') handler)
  noRethrow: false,
  // A map of state changes to run before instantiation,
  // where the key is the path and value is the state value
  stateChanges: {},
  // Sequence execution returns promises
  returnSequencePromise: false
})
```

## Methods

### getState

Returns state from the state tree

```js
const someState = app.getState('some.state')
```

### getSequence

Returns sequence from Cerebral

```js
const someSequence = app.getSequence('some.sequence')
// Run sequence
someSequence({ foo: 'bar' })
```

### getModel

Returns the model (state tree) of Cerebral

```js
const model = app.getModel()
```

### flush

Flushes out changes to UI based on recent state changes, can be forced

```js
app.flush()
```

### runSequence

Allows you to run an arbitrary function tree definition

```js
app.runSequence('someSequence', [actionA, actionB], { foo: 'bar' })
```

### addModule

Allows you to add modules to the app after instantiation (lazy)

```js
app.addModule('someModule', module)
```

### removeModule

Allows you to remove modules from the app

```js
app.removeModule('someModule')
```

## Events

### initialized:model

Triggers when Cerebral model has initialized.

```js
app.on('initialized:model', () => {})
```

### initialized

Triggers when Cerebral app has initialized.

```js
app.on('initialized', () => {})
```

### flush

Triggered whenever Cerebral flushes out changes to the UI. Passes a map of changes.

```js
app.on('flush', (changes) => {})
```

### start

Triggered whenever Cerebral starts a sequence execution.

```js
app.on('start', (execution, payload) => {})
```

### end

Triggered whenever Cerebral ends a sequence execution.

```js
app.on('end', (execution, payload) => {})
```

### pathStart

Triggered whenever Cerebral starts execution a path in a sequence

```js
app.on('pathStart', (execution, payload) => {})
```

### pathEnd

Triggered whenever Cerebral ends execution a path in a sequence

```js
app.on('pathEnd', (execution, payload) => {})
```

### functionStart

Triggered whenever Cerebral starts executing an action.

```js
app.on('functionStart', (execution, functionDetails, payload) => {})
```

### functionEnd

Triggered whenever Cerebral ends executing an action.

```js
app.on(
  'functionEnd',
  (execution, functionDetails, payload, result) => {}
)
```

### asyncFunction

Triggered whenever Cerebral executed an async action.

```js
app.on('asyncFunction', (execution, functionDetails, payload) => {})
```

### parallelStart

Triggered whenever Cerebral executes actions in parallel.

```js
app.on(
  'parallelStart',
  (execution, payload, functionsToResolveCount) => {}
)
```

### parallelProgress

Triggered whenever Cerebral executes actions in parallel.

```js
app.on(
  'parallelProgress',
  (execution, payload, functionsStillResolvingCount) => {}
)
```

### parallelEnd

Triggered whenever Cerebral ends executing actions in parallel.

```js
app.on('parallelEnd', (execution, payload, functionsExecutedCount) => {})
```

### remember

Triggered whenever Cerebral travels back in time. Passes the timestamp it travelled to.

```js
app.on('remember', (datetime) => {})
```

### mutation

Triggered whenever Cerebral mutated the state

```js
app.on('mutation', (mutation) => {})
```
