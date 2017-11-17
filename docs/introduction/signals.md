# Signals

```marksy
<Youtube url="https://www.youtube.com/embed/o2ULoHp22BE" />
```

## Actions

An action is just a function. What makes an action different from a normal function though is that it receives only one argument, created by Cerebral. It is called the **context**. Actions are "low level" and imperative. There is no declarative code without some imperative code behind it.

```js
export function iAmAnAction (context) {

}
```

Whatever side effect you need to run or state changes that needs to be made, you do it from the context. It means you do not need any API to define an action or import any other modules to define business logic. This makes actions highly testable and easy to write.

Here is an example of an action changing the state of the application:

```js
export function iAmAnAction ({ state }) {
  state.set('foo', 'bar')
}
```

Or running an http request:

```js
export function iAmAnAction ({ http }) {
  return http.get('/user')
}
```

## Sequences

You trigger a signal when something happens in your application. For example a button is clicked, but also if a websocket connection receives a message. The signal runs one or more **sequences** of business logic. The sequences compose together actions which runs state changes, side effects and other logic in one coherent flow.

This is an example of a sequence that grabs a user and sets it.
```js
import * as actions from './actions'

export const initialize = [
  actions.getUser,
  actions.setUser,
]
```

Signals are added to your application in the modules:

```js
import { Module } from 'cereral'
import * as sequences from './sequences'

export default Module({
  signals: {
    initialized: sequences.initialize
  }
})
```

Cerebral uses the [function-tree](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/function-tree) project to implement its signals. A function-tree allows you to define a tree of functions to be executed. In Cerebral we call these **actions**.



## Paths
It is possible to diverge execution down specific paths.

```js
import * as actions from './actions'

export const initialize = [
  actions.getUser, {
    success: actions.setUser,
    error: actions.setError
  }
]
```

The **getUser** action could look like this:

```js
export function getUser ({ http, path }) {
  return http.get('/user')
    .then(response => path.success({ user: response.result }))
    .catch(error => path.error({ error }))
}
```

## Props

When a signal is executed a payload can be passed into it, called **props**. That means every action in the defined signal has access to these props.

Imagine a signal is triggered from a component with the payload `{foo: 'bar'}`. Now the whole flow of the signal has access to **props.foo**. An action in this signal could now use this prop to for example update the state of the application.

```js
export function updateFoo ({ state, props }) {
  state.set('foo', props.foo)
}
```

### Update props
You update the props on the signal by returning an object from the action. This object will be merged with existing props.

```js
export function iAmAnAction () {
  return {
    newProp: 'someValue'
  }
}
```

### Async
When actions return a promise the signal will hold execution until it is resolved. any resolved values will be merged in with props.

```js
export function iAmAnAction () {
  return new Promise((resolve) => {
    resolve({
      newProp: 'someValue'
    })
  })
}
```

You can also use `async` functions:

```js
export async function iAmAnAction ({ http }) {
  const response = await http.get('/user')

  return { user: response.result }
}
```

## Parallel execution
You can run actions in parallel. You do that by using the **parallel** function:

```js
import { parallel } from 'cerebral'
import * as actions from './actions'

export const mySequence = [
  parallel([
    actions.actionA,
    actions.actionB
  ]),
  actions.actionC
]
```

If *actionA* returns a promise *actionB* will still be run instantly, meaning that they run in parallel. When both *actionA* and *actionB* is done, *actionC* is run.

## Composing
Actions and a sequence of actions can be composed into other sequences of actions. This is a powerful concept that allows you to decouple a lot of your logic and compose it together wherever it is needed:

```js
import * as actions from './actions'

export const authenticate = [
  actions.getUser,
  actions.setUser
]

export const initialize = [
  authenticate,
  actions.setCurrentPage
]
```

The debugger will show **authenticate** as its own sequence, meaning that composition is visualized in the debugger. If you want you could even name this authenticate sequence, giving even more debugging information.

```js
import { sequence } from 'cerebral'
import * as actions from './actions'

export const authenticate = sequence('authenticate', [
  actions.getUser,
  actions.setUser
])

export const initialize = [
  authenticate,
  actions.setCurrentPage
]
```

## Operators

Cerebral also ships with what we call operators. Operators are just action factories that you can use to express logic without creating actions. Operators has a "declarative cost", meaning that you need to interpret what an operator does by reading its arguments. This opposed to just reading the name of an action. The benefit of operators is that you do not have to write the imperative logic for them. Read more about patterns to decide on your approach.

The most common operators you will use changes the state of your application.

```js
import { set } from 'cerebral/operators'
import { state } from 'cerebral/tags'

export const mySequence = [
  set(state`foo`, 'bar')
]
```

With the help of [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) we are able to express that we want to set the state path **foo** to have the value **"bar"**.

And this is how you go about using operators:

```js
import { merge, push, pop } from 'cerebral/operators'
import {state} from 'cerebral/tags'

export const mySequence = [
  merge(state`some.object`, {foo: 'bar'}),
  push(state`some.list`, 'foo'),
  pop(state`some.otherList`)
]
```

[Open this BIN](https://www.webpackbin.com/bins/-KpZAMSt49LlQHNhguls) to play around with some operators. Please feel free to use the same bin to test out the concepts reading on.
