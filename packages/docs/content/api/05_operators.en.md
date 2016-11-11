---
title: Operators
---

## Operators
Operators are function factories that returns an action. These allows you to do common things like updating state and control the flow.

```js
import {
  // template tags to target state and input
  state,
  input,

  // operators related to state
  concat,
  merge,
  pop,
  push,
  set,
  shift,
  splice,
  toggle,
  unset,
  unshift,

  // operators related to execution
  when,
  debounce,
  filter,
  wait
} from 'cerebral/operators'

export default [
  // Set some state
  set(state`foo.bar`, true),
  // Set value from input
  set(state`foo.bar`, input`value`)

  // Toggle a boolean value in your state
  toggle(state`foo`),

  // Merge. Supports using template tags on merged values
  merge(state`foo`, {
    bar: input`bar`,
    baz: state`baz`
  }),

  // Conditional truthy check of state or input
  when(state`foo.isAwesome`), {
    true: [],
    false: []
  },

  // Hold action until 200ms has passed. If signal
  // triggers again within 200ms the previous signal
  // goes down "discarded" path, while new signal holds
  // for 200ms. Typical typeahead functionality
  debounce(200), {
    accepted: [],
    discarded: []
  },
  // Short version, only accepted chain
  ...debounce(200, [])

  // Go down "accepted" when value matches filter
  // or "discarded" when it does not match
  filter(input`foo`, function minLength3(value) {
    return value.length >= 3
  }), {
    accepted: [],
    discarded: []
  },
  // Short version, only accepted chain
  ...filter(state`foo`, function minLength3(value) {
    return value.length >= 3
  }, []),

  // Wait 200ms, then continue chain
  wait(200)
]
```

#### Inline template tag
You can also use the template tags within a template.

```js
set(state`users.${input`userId`}.name`, input`name`)
```

### Custom operators
You can easily create your own operators and use the template tags.

```js
function mergeFactory(targetPathTemplate, valueTemplate) {
  function merge(context) {
    // We get details about the template by passing it the context
    const targetPath = targetPathTemplate(context)

    // Since we allow both using a template tag or a hardcoded value
    // we check if it is a function, which means a template. When
    // passing the context we call the "toValue" method which will
    // grab whatever value the template tag + path is pointing to
    const value = typeof valueTemplate === 'function' ? valueTemplate(context).toValue() : valueTemplate

    // We do not want to extract the value on "targetPath", but
    // rather ensure we are indeed targeting state and use
    // the produced path to set some state
    if (targetPath.target !== 'state') {
      throw new Error('You have to target state when merging')
    }

    context.state.set(targetPath.path, value)
  }

  return merge
}
```
