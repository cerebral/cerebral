# Action

When actions run they are passed a context. This context is created by Cerebral for every action run.

```js
function iAmAnAction(context) {}
```

The context is populated by Cerebral and you can configure this by creating **providers**. By default Cerebral adds the following providers on the context.

## Props

When you trigger a sequence you can pass it a payload. This payload is the starting point of the props to the sequence. Given the sequence:

```js
[actionA, actionB]
```

```js
someSequence({
  foo: 'bar'
})
```

The first action will receive the payload passed into the signal.

```js
function actionA({ props }) {
  props // {foo: "bar"}

  return {
    bar: 'baz'
  }
}
```

By returning a new object the next action will see an extended payload:

```js
function actionB({ props }) {
  props // {foo: "bar", bar: "baz"}
}
```

So returning an object from actions, either directly or from a promise, extends the payload for later actions to handle.

## Store

To change the state of your application you use the store API.

```js
function setSomething({ store }) {
  store.set('some.path.foo', 'bar')
}
```

All common state operations are available as a method. Instead of first pointing to a value and then operate, you operate first and give the path to the value.

```js
// Traditional approach
someArray.push('newItem')
// With Cerebral
store.push('path.to.array', 'newItem')
```

This is the one core concept of Cerebral that gives all its power. This simple approach allows for a few important things:

1.  Track mutations in the application so that it can be passed to the debugger
2.  Track mutations so that it can optimally inform components about needed renders
3.  No need for immutability or intercepting getters and setters

The following methods are available:

- **concat**
- **increment**
- **merge**
- **pop**
- **push**
- **set**
- **shift**
- **splice**
- **toggle**
- **unset**
- **unshift**

## Path

The path on the context is only available if there is actually expressed a path after the action in question:

```js
import * as actions from './actions'

export default [
  actions.actionA,
  actions.actionB,
  {
    foo: actions.actionC
  }
]
```

In this scenario only *actionB* has the path on its context. That means in any action you can check if path is available and what paths can be taken by looking at its keys.

## Get

You can grab any tag value by using *get*:

```js
import { state } from 'cerebral'

function someAction({ get }) {
  const foo = get(state`foo`)
}
```

## Resolve

**Get** is actually a wrapper around resolve and you should use that. **Resolve** has some additional functionality though. To resolve an argument passed to a factory you can use resolve:

```js
function someActionFactory(someArgument) {
  function someAction({ resolve }) {
    // The argument can be anything, even plain values
    const value = resolve.value(someArgument)
  }

  return someAction
}
```

You can also use resolve to check the value type and extract for example the path of tags:

```js
function someActionFactory(someArgument) {
  function someAction({ resolve }) {
    if (resolve.isTag(someArgument)) {
      const path = resolve.path(someArgument)
    }
  }

  return someAction
}
```