# Devtools

Cerebral's devtools provide powerful debugging capabilities through integration with the Cerebral debugger application.

## Configuration

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import main from './main'

const app = App(main, {
  devtools:
    process.env.NODE_ENV === 'production'
      ? null
      : Devtools({
          // Options here
          host: 'localhost:8585'
        })
})
```

## Options

| Option                     | Type    | Default | Description                                                                     |
| -------------------------- | ------- | ------- | ------------------------------------------------------------------------------- |
| `host`                     | String  | `null`  | **Required**. Host and port to connect to the debugger (e.g., 'localhost:8585') |
| `https`                    | Boolean | `false` | Whether to use secure WebSockets (wss://) for connecting                        |
| `reconnect`                | Boolean | `true`  | Whether to attempt reconnection if connection is lost                           |
| `reconnectInterval`        | Number  | `5000`  | Milliseconds to wait between reconnection attempts                              |
| `storeMutations`           | Boolean | `true`  | Whether to store mutations for time travel debugging                            |
| `preventExternalMutations` | Boolean | `true`  | Warn when mutations occur outside of Cerebral actions                           |
| `preventPropsReplacement`  | Boolean | `false` | Prevent props with the same key being replaced in sequence                      |
| `warnStateProps`           | Boolean | `true`  | Warn when passing objects/arrays as props to components                         |
| `bigComponentsWarning`     | Number  | `10`    | Show warning when components have more dependencies than this number            |
| `allowedTypes`             | Array   | `[]`    | Additional types allowed to be stored in state (beyond basic JS types)          |
| `disableDebounce`          | Boolean | `false` | Disable debouncing updates to the debugger                                      |

## Basic Setup

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import main from './main'

let devtools = null

if (process.env.NODE_ENV !== 'production') {
  devtools = Devtools({
    host: 'localhost:8585'
  })
}

const app = App(main, {
  devtools
})
```

## Advanced Configuration

### Type Safety

By default, Cerebral allows these types to be stored in state: Object, Array, String, Number, Boolean, File, FileList, Blob, ImageData, and RegExp. You can add additional types:

```js
devtools = Devtools({
  host: 'localhost:8585',
  allowedTypes: [MyCustomType, AnotherType]
})
```

### Securing Connections

For HTTPS sites, configure secure WebSocket connections:

```js
devtools = Devtools({
  host: 'localhost:8585',
  https: true // Use wss:// instead of ws://
})
```

### Debugging Large Applications

For large applications, you might want to adjust performance settings:

```js
devtools = Devtools({
  host: 'localhost:8585',

  // Increase threshold for component complexity warnings
  bigComponentsWarning: 20,

  // Disable storing mutations for time travel if memory usage is a concern
  storeMutations: false
})
```

## Debugger Features

### Time Travel

The devtools enable time travel debugging by recording mutations when `storeMutations` is `true`. This allows you to:

- Travel backward and forward in your application's history
- See the exact state at any point in time
- Understand the sequence of changes that led to a particular state

### State Tree Visualization

The debugger provides a visual representation of your state tree, showing:

- Current state values
- Components watching each state path
- Mutations in real-time

### Sequence Tracing

Track sequence executions with:

- Full action execution path
- Input and output values for each action
- Timing information

### Component Debugging

Monitor your components with:

- State dependency mapping
- Re-render tracking
- Performance optimization suggestions

## Events

The devtools emit and listen to several events:

- `remember`: Emitted when time traveling to a specific point
- `reset`: Emitted when the debugger state is reset
- `changeModel`: Emitted when state is changed via the debugger

## Environment Variables

You can control the devtools using environment variables:

```js
devtools =
  process.env.NODE_ENV === 'production'
    ? null
    : process.env.CEREBRAL_DEBUGGER_OFF === 'true'
      ? null
      : Devtools({ host: 'localhost:8585' })
```
