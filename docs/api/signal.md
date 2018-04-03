# Signal

Signals are just sequences which are expressed as arrays:

```js
export const mySequence = []
```

You populate these arrays with actions:

```js
export const mySequence = [actions.someAction]
```

You can attach sequences to signal definitions in the modules:

```js
import { Module } from 'cerebral'
import * as sequences from './sequences'

export default Module({
  signals: {
    somethingHappened: sequences.doSomething
  }
})
```

## Async

By default signals run completely synchronous, but an action might run asynchronously thus making the signal async. When an action returns a promise it means it runs async.

```js
export function myAction() {
  return Promise.resolve()
}
```

You could also use an **async** function:

```js
export async function myAction() {
  return { foo: 'bar' }
}
```

## Sequence

Simple format of a sequence is to use an array literal, as explained above. Actions are run one after the other. If the action returns a promise Cerebral will wait until it resolves before moving to the next action:

```js
import * as actions from '../actions'

export const mySequence = [actions.someAction]
```

The array is converted to a sequence, but you can also be explicit about it:

```js
import { sequence } from 'cerebral'
import * as actions from '../actions'

export const mySequence = sequence([actions.someAction])
```

You can name a sequence, which will be displayed in debugger:

```js
import { sequence } from 'cerebral'
import * as actions from '../actions'

export const mySequence = sequence('my sequence', [actions.someAction])
```

You can compose a sequence into existing sequence. The debugger will show this composition:

```js
import someAction from '../actions/someAction'
import * as actions from '../actions'

export const myOtherSequence = [actions.doThis]

export const mySequence = [actions.someAction, myOtherSequence]
```

## Parallel

Cerebral can not truly run actions in parallel (JavaScript is single threaded), but it can trigger multiple asynchronous actions at the same time, just like **Promise.all**. That means when Cerebral triggers actions defined within a parallel, it will not wait if a promise is returned, it will just move on to the next action. When all actions within a parallel is resolved it will move to the action after the parallel definition, if any:

```js
import { parallel } from 'cerebral'
import * as actions from './actions'

export const mySequence = parallel([
  actions.someAsyncAction,
  actions.someOtherAsyncAction
])
```

You can name a parallel, which will be displayed in debugger:

```js
import { parallel } from 'cerebral'
import * as actions from './actions'

export const mySequence = parallel('my parallel', [
  actions.someAsyncAction,
  actions.someOtherAsyncAction
])
```

You can compose parallel into any existing sequence:

```js
import { parallel } from 'cerebral'
import * as actions from './actions'

export const mySequence = [
  actions.someAction,
  parallel('my parallel', [
    actions.someAsyncAction,
    actions.someOtherAsyncAction
  ])
]
```

## Paths

You can diverge execution by defining paths in your signal.

```js
import * as actions from './actions'

export const mySequence = [
  actions.getItems,
  {
    success: [],
    error: []
  }
]
```

The action returned by **getItems** will now have access to a success and an error path and can call those based on the result of the http request.

You can define any path to execute:

```js
import * as actions from './actions'

export const mySequence = [
  actions.myAction,
  {
    foo: [],
    bar: [],
    bananas: [],
    apples: []
  }
]
```

When these paths are defined you will have access to corresponding paths in the action preceding the paths:

```js
function myAction({ path }) {
  path.foo
  path.bar
  path.bananas
  path.apples
}
```

To actually diverge down the path you have to call it and return it from the action:

```js
function myAction({ path }) {
  return path.foo()
}
```

Optionally pass a payload:

```js
function myAction({ path }) {
  return path.bananas({ foo: 'bar' })
}
```

With promises you just return it the same way:

```js
function myAction({ someProvider, path }) {
  return someProvider
    .doAsync()
    .then((result) => path.bananas({ data: result.data }))
}
```
