---
title: Operators
---

## Operators
You can call operators to create actions for you. These actions will help you change state and control the flow of execution.

### Operator tags
When using operators you want to express dynamic behavior. For example changing some state based on the input. Operator tags helps you express this. There are three operator tags available, **state**, **input** and **string**.

There are two parts to operator tags. A target, and a template. The target tells the operator what to use the template for. And the template resolves to a string, for whatever purpose. Usually it is a path to the state tree, or some value on an input, but it could be anything.

For example:

```js
state`foo.bar`
```

State is the target and "foo.bar" is the template. What this target and template is used for is decided by the operator.

Operator tags can also inline other operator tags. For example:

```js
state`users.${input`userId`}`
```

There is nothing magic about this, it is pure JavaScript and super helpful expressing your business logic.

### State operators
The methods for changing state within actions is also available as operators. All state operators supports using both **state** and **input** operator tags as values.

```js
import {
  state,
  input,
  set,
  unset,
  merge,
  toggle,
  push,
  unshift,
  concat,
  pop,
  shift,
  splice
} from 'cerebral/operators'

export default [
  // Set some state
  set(state`foo.bar`, true)

  // Set some input
  set(input`foo`, true)

  // Unset key from object
  unset(state`users.user0`),

  // Merge. Supports using template tags on merged values
  merge(state`foo`, {
    bar: input`bar`,
    baz: state`baz`
  }),

  // Toggle a boolean value in your state
  toggle(state`foo`),

  // Push value to array
  push(state`some.list`, 'foo'),

  // Concat value to array
  concat(state`some.list`, ['foo', 'bar']),

  // Unshift value to array
  unshift(state`some.list`, 'foo'),

  // Pop value off array
  pop(state`some.list`),

  // Shift value off array
  shift(state`some.list`),

  // Splice array
  splice(state`some.list`, 0, 2)
]
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
"discarded" path while the new signal holds for the given time. This is
typically used for typeahead functionality. Beware that the debounce operator
is **shared** globally: this means that any call to debounce cancels any
currently on hold signal. For a debounce that is not globally shared, use
`debounce.shared()` (see example below).

```js
import {debounce} 'cerebral/operators'

export default [
  ...debounce(200, [
    runThisAction
  ]),
]
```

For a debounce that is **not globally shared**, use `debounce.shared()`. This
is typically used with factories, for example to show notifications where the
notification should not be cancelled by another debounce call (like a typeahead
signal):

```js
import {debounce, input, set, state} from 'cerebral/operators'

// Now only calls to notificationDebounce cancel signals waiting on this.
const notificationDebounce = debounce.shared()

export default [
  set(state`notification`, input`message`),
  ...notificationDebounce(5000, [
    unset(state`notification`)
  ])
]
```

With this notification signal, there is always a single notification present and
the notification is always shown for 5 seconds (unless it is overwritten by
another notification). Other calls to `debounce` will not cancel this one.

#### wait

Wait for the given time in milliseconds and then continue chain.

```js
import {wait} from 'cerebral/operators'

export default [
  ...wait(200, [
    doSomething
  ])
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

### Custom operators
You can easily create your own operators and use the operator tags. Here showing the implementation of **set**

```js
function setFactory(target, value) {
  function set(context) {
    // Returns an object with type of operator tag, the path
    // it resolves to and any value it resolves to. So given
    // state {foo: 'bar'}, the operator tag: state`foo` resolves
    // to {target: 'state', path: 'foo', value: 'bar'}
    const targetTemplate = target(context)

    // We now check if the target is correct
    if (targetTemplate.target !== 'state') {
      throw new Error('You have to target state when merging')
    }

    // Since we allow both using an operator tag or a hardcoded value
    // we check if it is a function, which means it is an operator tag.
    // Then we either grab the value from the operator tag or the value
    // passed in
    const setValue = typeof value === 'function' ? value(context).value : value

    context.state.set(targetTemplate.path, setValue)
  }

  return set
}
```

Custom operators often wants to extract paths, though not necessarily related to state or input. That is why we have operator tag **string**.

```js
import {string} from 'cerebral/operators'
import showMessage from '../factories/showMessage'
import starsCount from '../computeds/starsCount'
[
  showMessage(string`There are ${starsCount} left`)
]
```
