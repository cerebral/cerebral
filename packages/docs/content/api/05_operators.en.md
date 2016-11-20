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
There are also operators that helps control the flow of execution.

```js
import {
  state,
  input,
  when,
  equals,
  wait,
  debounce
} from 'cerebral/operators'

export default [
  // Conditional truthy check of state or input
  when(state`foo.isAwesome`), {
    true: [],
    false: []
  },
  // You can also pass your own function
  when(state`foo.isAwesome`, (value) => value.length === 3 ), {
    true: [],
    false: []
  },

  // Based on value go down a specific path
  equals(state`user.role`), {
    admin: [],
    user: [],
    otherwise: [] // When no match
  },

  // Wait 200ms, then continue chain
  ...wait(200, [
    doSomething
  ]),

  // Hold action until 200ms has passed. If signal
  // triggers again within 200ms the previous signal
  // goes down "discarded" path, while new signal holds
  // for 200ms. Typical typeahead functionality
  ...debounce(200, [
    runThisAction
  ]),
]
```

The **debounce** operator cancels out the existing call to the action returned when the signal triggers again within the milliseconds set. This is typically used with factories, for example to show notifications:

```js
import {debounce} from 'cerebral/operators'

const sharedDebounce = debounce.share()
function showNotificationFactory(message, ms) {
  function showNotification({state}) {
    state.set('notification', message)
  }

  function hideNotification() {
    state.set('notification', null)
  }

  return [
    showNotification,
    ...sharedDebounce(ms, [
      hideNotification
    ])
  ]
}
```

Wherever this **showNofication** factory is used, in whatever signal, it will cancel out any other. This makes sure that notifications are always shown at the set time, no matter what existing notification is already there.

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
