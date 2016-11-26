---
title: Operators
---

## Operators
You can call operators to create actions for you. These actions will help you
change state and control the flow of execution.

### Operator tags
When using operators you want to express dynamic behavior. For example changing
some state based on the input. Operator tags helps you express this. There are
three operator tags available, `state`, `input` and `string`.

There are two parts to operator tags. A target, and a template. The target tells
the operator what to use the template for. And the template resolves to a
string, for whatever purpose. Usually it is a path to the state tree, or some
value on an input, but it could be anything.

For example:

```js
state`foo.bar`
```

State is the target and "foo.bar" is the template. What this target and template
is used for is decided by the operator.

Operator tags can also inline other operator tags. For example:

```js
state`users.${input`userId`}`
```

There is nothing magic about this, it is pure JavaScript and is a very helpful
way of expressing business logic. Here are that operator tags for Cerebral:

#### input

Input can be used both as a value source and as value target for operations.

Get input value:

```js
set(state`notification`, input`message`)
```

Set input value for next actions in chain:

```js
set(input`key`, state`clients.$draft.key`)
```

#### state

State can be used both as a value source and as value target for operations.

Get state value:

```js
set(input`value`, state`clients.all.${input`key`}`)
```

Mutate state:

```js
set(state`key`, input`key`)
```

#### string

The string operator tag is used when not targeting state or input. For example the HTTP provider uses it to dynamically build urls:

```js
httpGet(string`/items/${input`itemId`}`)
```

You might want to use it for a notification factory or similar:

```js
showMessage(string`Hi there ${state`user.name`}, whatup?`)
```

### State operators

The methods for changing state within actions is also available as operators.
All state operators support using both `state` and `input` operator tags as
values.

All operators are imported as members of the 'cerebral/operators' module. For
example, this imports `state` and `set`:

```js
import {set, state} from 'cerebral/operators'
```

#### concat

Concatenate a value to an array

```js
concat(state`some.list`, ['foo', 'bar'])
```

#### merge

Merge each value inside a given target. Merge supports using template tags on
merged values. Note that the braces here do not indicate a path for signal flow
and is placed inside the function call:

```js
merge(state`clients.$draft`, {
  key: input`key`,
  name: state`clients.$filter`
})
```

#### pop

Pop a value off an array (removes last element from array).

```js
pop(state`some.list`)
```

#### push

Push value into an array (adds the element at the end of the array).

```js
push(state`some.list`, 'foo')
```

#### set

Set a target value in the state or input.

```js
set(state`foo.bar`, true),
set(input`foo`, true)
```

#### shift

Shift a value off an array (removes first element in array).

```js
shift(state`some.list`),
```

#### splice

Splice an array in place.

```js
splice(state`some.list`, 0, 2)
```

#### toggle

Toggle a boolean value.

```js
toggle(state`user.$toolbar`)
```

#### unset

Unset key from object.

```js
unset(state`clients.all.${input`key`}`)
```

#### unshift

Unshift a value into an array (adds the element at the start of the array).

```js
unshift(state`some.list`, 'foo')
```

### Flow control operators

These operators help control the execution flow.

#### equals

This operator chooses a specific path based on the provided value.

```js
import {equals, state} from 'cerebral/operators'

export default [
  equals(state`user.role`), {
    admin: [],
    user: [],
    otherwise: [] // When no match
  }
],
```

#### debounce

Hold action until the given amount of time in milliseconds has passed. If the
signal triggers again within this time frame, the previous signal goes down the
"discard" path while the new signal holds for the given time. This is
typically used for typeahead functionality. For a debounce that is shared
across different signals, you can use `debounce.shared()` (see example below).

Please note that the `discard` path has to be present even if it is most often
empty because debounce is a flow operator that routes the flow depending on
time and action trigger.

```js
import {debounce} 'cerebral/operators'

export default [
  debounce(200), {
    continue: [runThisAction],
    discard: []
  },
]
```

`debounce.shared()` is typically used with factories, for example to show
notifications where a previous notification should be cancelled by a new one.

```js
import {debounce, set, state, unset} from 'cerebral/operators'

const sharedDebounce = debounce.share()
function showNotificationFactory(message, ms) {
  return [
    set(state`notification`, message),
    sharedDebounce(ms), {
      continue: [unset(state`notification`)],
      discard: []
    }
  ]
}
```

Now when this notification factory is used in different signals, the call to
`debounceShared` will share the same debounce execution state:

```js
import showNotification from './showNotification'

export default [
  // ... user log in, etc
  ...showNotification('User logged in', 5000)
]
```

#### wait

Wait for the given time in milliseconds and then continue chain.

```js
import {wait} from 'cerebral/operators'

export default [
  wait(200),
  doSomethingAfterWaiting
]
```

If you need to wait while executing in parallel, you should use a `continue`
path to isolate the actions to be run:

```js
import {wait} from 'cerebral/operators'

export default [
  [ // this runs in parallel
    wait(200), {
      continue: [doSomethingAfterWaiting]
    },
    otherActionInParallel
  ]
]
```

#### when

Run signal path depending on a truth value or function evaluation.

```js
import {when} from 'cerebral/operators'

export default [
  when(state`foo.isAwesome`), {
    true: [],
    false: []
  },
  // You can also pass your own function
  when(state`foo.isAwesome`, (value) => value.length === 3 ), {
    true: [],
    false: []
  }
]
```

When used with a truth function, the `when` operator supports more then a single
"value" argument. The truth function must come last.

```js
import {input, state, when} from 'cerebral/operators'

export default [
  when(state`clients.$draft.key`, input`key`,
    (draftKey, updatedKey) => draftKey === updatedKey
  ), {
    true: [
      // Another person edited client, reset form to new value
      set(state`clients.$draft`, input`value`)
    ],
    false: []
  }
]
```
