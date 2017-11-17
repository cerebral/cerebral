# Action

When actions run they are passed a context. This context is created by Cerebral for every action run.

```js
function iAmAnAction (context) {}
```

The context is populated by Cerebral and you can configure this by creating **providers**. By default Cerebral adds the following providers on the context.

## Props

When you trigger a signal you can pass it a payload. This payload is the starting point of the props to the signal. Given the signal:

```js
[
  actionA,
  actionB
]
```

```js
someSignal({
  foo: 'bar'
})
```

The first action will receive the payload passed into the signal.

```js
function actionA ({ props }) {
  props // {foo: "bar"}

  return {
    bar: 'baz'
  }
}
```

By returning a new object the next action will see an extended payload:

```js
function actionB ({ props }) {
  props // {foo: "bar", bar: "baz"}
}
```

So returning an object from actions, either directly or from a promise, extends the payload for later actions to handle.

## State
To change the state of your application you use the state API. It is available to every action.

```js
function setSomething ({ state }) {
  state.set('some.path.foo', 'bar')
}
```

All common state operations are available as a method. Instead of first pointing to a value and then operate, you operate first and give the path to the value.

```js
// Traditional approach
someArray.push('newItem')
// With Cerebral
state.push('path.to.array', 'newItem')
```

This is the one core concept of Cerebral that gives all its power. This simple approach allows for a few important things:

1. Track mutations in the application so that it can be passed to the debugger
2. Track mutations so that it can inform components depending on the changes
3. Only allow mutations through the API, and nowhere else in the application (using freezing during development)

## Module
This is the same as **state**, though the path already points to the module running the signal. So you give a relative path.

```js
function setSomething ({ module }) {
  // Already points to some.module
  module.set('foo', 'bar')
}
```

## Path
The path on the context is only available if there is actually expressed a path after the action in question:

```js
import actionA from '../actions/actionA'
import actionB from '../actions/actionB'
import actionC from '../actions/actionC'

export default [
  actionA,
  actionB, {
    foo: actionC
  }
]
```

In this scenario only *actionB* has the path on its context.

## Resolve
**Tags** and **Compute** needs resolving. In most scenarios you do not have to think about this, but you might want to do this manually in an action. This is typically related to action factories. To resolve an argument passed to a factory you can use resolve:

```js
function someActionFactory(someArgument) {
  function someAction ({ resolve }) {
    // The argument can be anything, even plain values
    const value = resolve.value(someArgument)
  }

  return someAction
}
```

You can also use resolve to check the value type and extract for example the path of tags:

```js
function someActionFactory(someArgument) {
  function someAction ({ resolve }) {
    if (resolve.isTag(someArgument)) {
      const path = resolve.path(someArgument)
    }
  }

  return someAction
}
```


## Controller
You have access to the controller instance on the context:

```js
function someAction ({ controller }) {}
```
