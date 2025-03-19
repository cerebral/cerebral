# App

The `App` function creates the main Cerebral controller instance that manages your application state and logic.

## Initialization

```js
import App from 'cerebral'
import main from './main' // The root module

const app = App(main, {
  // Options (all optional)
  devtools: null, // Debugger integration
  throwToConsole: true, // Log errors to console
  noRethrow: false, // Prevent rethrow of errors after handling
  stateChanges: {}, // Initial state changes
  returnSequencePromise: false, // Make sequences return promises
  hotReloading: false // Handle hot reloading
})
```

### Options

| Option                  | Type        | Default | Description                                                |
| ----------------------- | ----------- | ------- | ---------------------------------------------------------- |
| `devtools`              | Object/null | null    | [Debugger](/docs/introduction/debugger.html) configuration |
| `throwToConsole`        | Boolean     | true    | Log caught errors to console                               |
| `noRethrow`             | Boolean     | false   | Prevent rethrowing errors after handling them              |
| `stateChanges`          | Object      | {}      | Initial state changes to apply                             |
| `returnSequencePromise` | Boolean     | false   | Make sequence executions return promises                   |
| `hotReloading`          | Boolean     | false   | Enable smart merging for hot reloading                     |

## State Management

### getState

Gets state from a specific path.

```js
// Get value at path
const user = app.getState('user')

// Get nested value
const username = app.getState('user.details.name')

// Get full state tree
const fullState = app.getState()
```

### get

Gets a value using a tag.

```js
import { state } from 'cerebral'

// Get state using tag
const user = app.get(state`user`)

// With dynamic path
const item = app.get(state`items.${itemId}`)
```

## Sequences

### getSequence

Returns a callable sequence from a specific path.

```js
// Get a sequence
const authenticate = app.getSequence('auth.authenticate')

// Run the sequence with optional payload
authenticate({ username: 'user', password: 'pass' })
```

### getSequences

Returns all sequences from a module.

```js
// Get all sequences from a module
const authSequences = app.getSequences('auth')

// Run a sequence from the collection
authSequences.authenticate({ username: 'user' })
```

### runSequence

Run an arbitrary sequence definition.

```js
// Run an inline sequence
app.runSequence(
  'myInlineSequence',
  [setLoading(true), fetchData, setLoading(false)],
  { id: 123 }
)

// Run a predefined sequence by path
app.runSequence('auth.authenticate', {
  username: 'user',
  password: 'pass'
})
```

## Module Management

### addModule

Add a module after app initialization.

```js
import analyticsModule from './modules/analytics'

// Add a module at a specific path
app.addModule('analytics', analyticsModule)

// Add a nested module
app.addModule('settings.theme', themeModule)
```

### removeModule

Remove a module from the app.

```js
// Remove a module
app.removeModule('analytics')

// Remove a nested module
app.removeModule('settings.theme')
```

## Other Methods

### getModel

Returns the model (state tree) of the app.

```js
const model = app.getModel()
```

### flush

Triggers UI updates based on state changes.

```js
// Standard flush
app.flush()

// Force flush regardless of changes
app.flush(true)
```

## Events

The app instance is an event emitter that you can subscribe to:

```js
// Listen for a specific event
app.on('flush', (changes) => {
  console.log('State changes:', changes)
})

// Remove an event listener
app.off('flush', myListener)

// Listen once for an event
app.once('initialized', () => {
  console.log('App is ready!')
})
```

### Lifecycle Events

| Event               | Arguments      | Description                           |
| ------------------- | -------------- | ------------------------------------- |
| `initialized:model` | -              | Model has initialized                 |
| `initialized`       | -              | App has fully initialized             |
| `moduleAdded`       | `path, module` | A module has been added               |
| `moduleRemoved`     | `path, module` | A module has been removed             |
| `flush`             | `changes`      | State changes have been applied to UI |

### Sequence Execution Events

| Event              | Arguments                                          | Description                        |
| ------------------ | -------------------------------------------------- | ---------------------------------- |
| `start`            | `execution, payload`                               | Sequence execution started         |
| `end`              | `execution, payload`                               | Sequence execution ended           |
| `pathStart`        | `execution, payload`                               | Path execution started             |
| `pathEnd`          | `execution, payload`                               | Path execution ended               |
| `functionStart`    | `execution, functionDetails, payload`              | Action execution started           |
| `functionEnd`      | `execution, functionDetails, payload, result`      | Action execution ended             |
| `asyncFunction`    | `execution, functionDetails, payload`              | Async action executed              |
| `parallelStart`    | `execution, payload, functionsToResolveCount`      | Parallel execution started         |
| `parallelProgress` | `execution, payload, functionsStillResolvingCount` | Parallel execution progress update |
| `parallelEnd`      | `execution, payload, functionsExecutedCount`       | Parallel execution ended           |
| `mutation`         | `mutation`                                         | State mutation occurred            |
| `remember`         | `datetime`                                         | Time travel occurred (debugging)   |

## Example

```js
import App from 'cerebral'
import main from './main'

const app = App(main, {
  devtools: process.env.NODE_ENV === 'development' && {
    host: 'localhost:8585',
    reconnect: true
  }
})

// Wait for initialization
app.once('initialized', () => {
  // App is ready to use
  app.getSequence('app.initialize')()

  // Listen for state changes
  app.on('flush', (changes) => {
    console.log('Changes:', changes)
  })
})
```

See [UniversalApp](/docs/api/universalapp.html) for server-side rendering support.
