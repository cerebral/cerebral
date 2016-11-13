---
title: Operators
---

## Operators
Operators are function factories that returns an action. These allows you to do common things like updating state and control the flow.

### Template tags
When using operators you typically use a lot of template tags. These template tags are plain JavaScript which is used to target and extract data. The tree template tags available are:

```js
import {set, state, input} from 'cerebral/operators'

// Example with state
[
  set(state`foo`, 'bar')
]

// Example with state and input
[
  set(state`foo`, input`foo`)
]
```

The template tags can be inlined, allowing you to do things like:

```js
import {set, state, input} from 'cerebral/operators'

[
  set(state`users.${input`userId`}.isAwesome`, true)
]
```

It is also possible to use computed inline with template tags. For example:

```js
import {set, state, input} from 'cerebral/operators'
import someComputed from '../computeds/someComputed'

[
  set(state`foo.${someComputed}`, true)
]
```

### State operators
The methods available on **state** inside actions is also available as operators to make simple state changes. All these operators supports using **input** as value, where available.

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
You can easily create your own operators and use the template tags. Here showing the implementation of **set**

```js
function setFactory(target, value) {
  function set(context) {
    // Returns an object with type of template tag, the path
    // it resolves to and any value it resolves to. So given
    // state {foo: 'bar'}, the template tag: state`foo` resolves
    // to {target: 'state', path: 'foo', value: 'bar'}
    const targetTemplate = target(context)

    // We now check if the target is correct
    if (targetTemplate.target !== 'state') {
      throw new Error('You have to target state when merging')
    }

    // Since we allow both using a template tag or a hardcoded value
    // we check if it is a function, which means it is a template tag.
    // Then we either grab the value from the template tag or the value
    // passed in
    const setValue = typeof value === 'function' ? value(context).value : value

    context.state.set(targetTemplate.path, setValue)
  }

  return set
}
```

Custom operators often wants to extract paths, though not necessarily related to state or input. That is why we have template tag **string**:

```js
import {string} from 'cerebral/operators'
import showMessage from '../factories/showMessage'
import starsCount from '../computeds/starsCount'
[
  showMessage(string`There are ${starsCount} left`)
]
```
