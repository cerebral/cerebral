# Parallel
A parallel runs actions all actions right after each other, even if they return a promise.

```js
import {parallel} from 'cerebral'
import someAsyncAction from '../actions/someAsyncAction'
import someOtherAsyncAction from '../actions/someOtherAsyncAction'

export default parallel([
  someAsyncAction,
  someOtherAsyncAction
])
```

## Name
You can name a parallel, which will be displayed in debugger:
```js
import {parallel} from 'cerebral'
import someAsyncAction from '../actions/someAsyncAction'
import someOtherAsyncAction from '../actions/someOtherAsyncAction'

export default parallel('my parallel', [
  someAsyncAction,
  someOtherAsyncAction
])
```

## Compose
You can compose parallel into any existing sequence:
```js
import {parallel} from 'cerebral'
import someAction from '../actions/someAction'
import someAsyncAction from '../actions/someAsyncAction'
import someOtherAsyncAction from '../actions/someOtherAsyncAction'

export default [
  someAction,
  parallel('my parallel', [
    someAsyncAction,
    someOtherAsyncAction
  ])
]
```

## Abort
You can abort a parallel execution:

```js
import {parallel} from 'cerebral'

function someActionAborting ({abort}) {
  return abort({}) // Optional payload
}
function someAction () {}
function someActionHandlingAbort () {}

export default parallel('my parallel', [
  someActionAborting, {
    success: [], // Will not run
    error: [] // Will not run
  },
  someAction, { // Runs until resolved
    success: [], // Will not run if executed after abort
    error: [] // Will not run if executed after abort
  }
], [
  someActionHandlingAbort
])
```

Abort does not **bubble**, meaning actions that abort will only reach its specific abort sequence.
