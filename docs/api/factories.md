# Factories

You can call factories to create actions for you. These actions will help you change state and control the flow of execution.

Read more about factories in the [the guide](/docs/guides/factories) article.

## Store factories

The methods for changing state within actions are also available as factories.

All store are imported as members of the 'cerebral/factories' module. For example:

```js
import { set } from 'cerebral/factories'
```

### concat

Concatenate a value to an array

```js
concat(state.some.list, ['foo', 'bar'])
```

### increment

Increment an integer value by another integer value into an array. The default increment is 1, and a negative value effectively does a decrement.

```js
increment(state.some.integer)
increment(state.some.integer, -5)
increment(state.some.integer, state.some.otherInteger)
increment(state.some.integer, props.some.otherInteger)
```

### merge

Merge objects into existing value. If no value exists, an empty object will be created. Merge supports using operator tags on key values:

```js
merge(state.clients.$draft, props.newDraft, {
  foo: 'bar',
  bar: props.baz
})
```

### pop

Pop a value off an array (removes last element from array).

```js
pop(state.some.list)
```

### push

Push value into an array (adds the element at the end of the array).

```js
push(state.some.list, 'foo')
```

### set

Set a target value in the state or props.

```js
set(state.foo.bar, true)
set(props.foo, true)
```

Optionally transform the value before setting

```js
set(state.some.number, props.number, (value) => value * 2)
```

### shift

Shift a value off an array (removes first element in array).

```js
shift(state.some.list),
```

### splice

Splice an array in place.

```js
splice(state.some.list, 0, 2)
```

### toggle

Toggle a boolean value.

```js
toggle(state.user.$toolbar)
```

### unset

Unset key from object.

```js
unset(state.clients.all[props.key])
```

### unshift

Unshift a value into an array (adds the element at the start of the array).

```js
unshift(state.some.list, 'foo')
```

## Flow control factories

These factories help control the execution flow.

### debounce

Hold action until the given amount of time in milliseconds has passed. If the
sequence triggers again within this time frame, the previous sequence goes down the
"discard" path while the new sequence holds for the given time. This is
typically used for typeahead functionality. For a debounce that is shared
across different signals, you can use `debounce.shared()` (see example below).

Please note that the `discard` path has to be present even if it is most often
empty.

```js
import { debounce } from 'cerebral/factories'

export default [
  debounce(200),
  {
    continue: runThisActionOrSequence,
    discard: []
  }
]
```

`debounce.shared()` is typically used with factories, for example to show
notifications where a previous notification should be cancelled by a new one.

```js
import { debounce, set, unset } from 'cerebral/factories'
import { state } from 'cerebral'

const sharedDebounce = debounce.shared()
function showNotificationFactory(message, ms) {
  return [
    set(state.notification, message),
    sharedDebounce(ms),
    {
      continue: unset(state.notification),
      discard: []
    }
  ]
}
```

Now when this notification factory is used in different sequence, the call to
`debounceShared` will share the same debounce execution state:

```js
import * as factories from './factories'

export default factories.showNotification('User logged in', 5000)
```

### equals

This operator chooses a specific path based on the provided value.

```js
import { equals } from 'cerebral/factories'
import { state } from 'cerebral'

export default [
  equals(state.user.role), {
    admin: [],
    user: [],
    otherwise: [] // When no match
  }
],
```

### wait

Wait for the given time in milliseconds and then continue chain.

```js
import { wait } from 'cerebral/factories'

export default [
  wait(200),
  doSomethingAfterWaiting
]
```

If you need to wait while executing in parallel, you should use a `continue`
path to isolate the sequence to be run:

```js
import { wait } from 'cerebral/factories'
import { parallel } from 'cerebral'

export default
  someAction,
  parallel('my parallel with wait', [
    wait(200), {
      continue: [doSomethingAfterWaiting]
    },
    otherActionInParallel
  ])
]
```

### when

Run signal path depending on a truth value or function evaluation.

```js
import { when } from 'cerebral/factories'
import { state } from 'cerebral'

export default [
  when(state.foo.isAwesome),
  {
    true: [],
    false: []
  },
  // You can also pass your own function
  when(state.foo.isAwesome, (value) => value.length === 3),
  {
    true: [],
    false: []
  }
]
```

When used with a truth function, the `when` operator supports more then a single
"value" argument. The predicate function must come last.

```js
import { when } from 'cerebral/factories'
import { props, state } from 'cerebral'

export default [
  when(
    state.clients.$draft.key,
    props.key,
    (draftKey, updatedKey) => draftKey === updatedKey
  ),
  {
    true: set(state.clients.$draft, props.value),
    false: []
  }
]
```
