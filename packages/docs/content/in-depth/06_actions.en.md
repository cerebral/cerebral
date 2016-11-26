---
title: Actions
---

## Actions

A signal runs actions and actions are actually just functions.

```js
function iAmAnAction () {}
```

That means you do not need any API to define an action. This makes actions highly testable.

### The context
When actions run they are passed a context. This context is created by Cerebral for every action run.

```js
function iAmAnAction (context) {}
```

The context is populated by Cerebral and you can configure this by creating **providers**. By default Cerebral adds the following providers on the context.

#### Input

When you trigger a signal you can pass it a payload. This payload is the starting point of the input to the signal. Given the signal:

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
function actionA ({input}) {
  input // {foo: "bar"}

  return {
    bar: 'baz'
  }
}
```

By returning a new object the next action will see an extended input:

```js
function actionB ({input}) {
  input // {foo: "bar", bar: "baz"}
}
```

So returning an object from actions extends the input for later actions to handle.

#### State
To change the state of your application you use the state API. It is available to every action.

```js
function setSomething ({state}) {
  state.set('some.path.foo', 'bar')
}
```

All common state operations are available as a method. Instead of first pointing to a value and then operate, you operator first and give the path to the value.

```js
// Traditional approach
someArray.push('newItem')
// With Cerebral
state.push('path.to.array', 'newItem')
```

This is the one core concept of Cerebral that gives all its power. This simple approach allows for a few important things:

1. Track mutations in the application so that it can be passed to the debugger
2. Track mutations so that it can inform components depending on the paths to render
3. Only allow mutations through the API, and nowhere else in the application (using freezing during development)

#### Path
The path on the context is only available if there is actually expressed a path after the action in question:

```js
import actionA from '../actions/actionA'
import actionB from '../actions/actionB'
import actionC from '../actions/actionC'

export default [
  actionA,
  actionB, {
    foo: [actionC]
  }
]
```

In this scenario only *actionB* has the path on its context. As explained in **Chains and paths**, the path allows you to diverge execution of the signal.

#### Controller
You have access to the controller instance on the context:

```js
function someAction ({controller}) {}
```

#### Execution
You have access to function trees execution as well. This holds information about the current execution, mostly used by the devtools to inform the debugger.

```js
function someAction ({execution}) {}
```
