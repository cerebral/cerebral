# Action

Actions are the building blocks of sequences in Cerebral. When actions run they receive a context object with tools and values to interact with your app.

```js
function myAction(context) {
  // Use context to access state, props, etc.
}
```

The context is populated by Cerebral and can be extended with custom **providers**. By default, Cerebral includes the following on the context:

## Props

When you trigger a sequence you can pass it a payload. This payload is the starting point of the props for the sequence:

```js
// Define a sequence with multiple actions
const mySequence = [actionA, actionB]

// Trigger the sequence with initial props
mySequence({
  foo: 'bar'
})
```

The first action will receive the payload passed to the sequence:

```js
function actionA({ props }) {
  props // {foo: "bar"}

  return {
    bar: 'baz'
  }
}
```

By returning an object, you extend the props for the next action:

```js
function actionB({ props }) {
  props // {foo: "bar", bar: "baz"}
}
```

Return values from actions, either directly or from a promise, are merged with existing props for subsequent actions to use.

## Store

To change the state of your application, use the store API:

```js
function setSomething({ store }) {
  store.set('some.path.foo', 'bar')
}
```

Cerebral uses a direct mutation approach instead of relying on immutability patterns. Instead of first accessing a value and then operating on it, you specify the operation first and then the path to the value:

```js
// Traditional approach
someArray.push('newItem')

// With Cerebral
store.push('path.to.array', 'newItem')
```

This approach enables Cerebral to:

1. Track mutations for debugging
2. Efficiently update components based on state changes
3. Avoid the complexity of immutability patterns

Available store methods include:

- **set** - Set a value at a specific path
- **concat** - Concatenate arrays
- **increment** - Increase a number by a specified value
- **merge** - Merge objects
- **pop** - Remove the last item in an array
- **push** - Add items to the end of an array
- **shift** - Remove the first item in an array
- **splice** - Remove or replace elements in an array
- **toggle** - Toggle a boolean value
- **unset** - Remove a property from an object
- **unshift** - Add elements to the beginning of an array

## Path

The path property is only available when your action is followed by a paths object:

```js
import * as actions from './actions'

export default [
  actions.actionA,
  actions.actionB,
  {
    success: actions.actionC,
    error: actions.actionD
  }
]
```

In this example, only `actionB` has access to the path property, allowing it to choose between the "success" and "error" paths:

```js
function actionB({ path }) {
  // Choose which path to take
  if (someCondition) {
    return path.success()
  } else {
    return path.error()
  }
}
```

## Get

You can access state, props, computed values, and sequences using the `get` function:

```js
import { state, props } from 'cerebral'

function someAction({ get }) {
  const foo = get(state`foo`) // Get state value
  const user = get(state`users.${props`userId`}`) // Dynamic path
}
```

<Info>
You can also use object notation (like `state.foo`) with the [babel-plugin-cerebral](/docs/api/proxy.html).
</Info>

## Resolve

The `resolve` utility allows you to work with tags and values at a lower level. `get` is actually a wrapper around `resolve`:

```js
function someActionFactory(someArgument) {
  function someAction({ resolve }) {
    // Resolve any value, including tags
    const value = resolve.value(someArgument)

    // Check if an argument is a tag
    if (resolve.isTag(someArgument)) {
      // Get the path string of a tag
      const path = resolve.path(someArgument)
    }
  }

  return someAction
}
```

This is particularly useful when creating factories that accept a mix of static values and tags.
