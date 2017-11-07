# Signals

```marksy
<Youtube url="https://www.youtube.com/embed/o2ULoHp22BE" />
```

You trigger a signal when something happens in your application. For example a button is clicked, but also if a websocket connection receives a message. The signal runs the business logic of your application. You compose together state changes, side effects and other logic in one coherent flow.

This is an example of a signal added to the root of the controller:

```js
import {Controller} from 'controller'
import someAction from './actions/someAction'

const controller = Controller({
  signals: {
    somethingHappened: [
      someAction
    ]
  }
})

// Typically you do not extract signals directly like
// this, but it shows you that a signal is just a function
// you call
const signal = controller.getSignal('somethingHappened')
signal()
```

You will learn later how you can use **modules** to encapsulate signals with state.

Cerebral uses the [function-tree](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/function-tree) project to implement its signals. A function-tree allows you to define a tree of functions to be executed. In Cerebral world we call the functions in this tree **actions**.

## Operators

Although you will need to create actions in your application, most of your logic can be expressed using what we call operators. Instead of referencing a function to run, you rather call a function that returns a function. This is what we generally in programming call function factories and you will use them a lot. The included function factories in Cerebral are called **operators**. They typically make state changes, but can also control execution flow and even time.

The most common operators you will use changes the state of your application.

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo`, 'bar')
]
```

With the help of [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) we are able to express that we want to set the state path **foo** to have the value **"bar"**.

And this is how you go about using operators:

```js
import {merge, push, pop} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  merge(state`some.object`, {foo: 'bar'}),
  push(state`some.list`, 'foo'),
  pop(state`some.otherList`)
]
```

[Open this BIN](https://www.webpackbin.com/bins/-KpZAMSt49LlQHNhguls) to play around with some operators. Please feel free to use the same bin to test out the concepts reading on.

## Paths
It is possible to diverge execution down specific paths. For example some included operators requires you to define paths:

```js
import {when, equals} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  when(state`app.isAwesome`), {
    true: [],
    false: []
  },
  equals(state`user.role`), {
    admin: [],
    user: [],
    otherwise: []
  }
]
```

When you build custom actions you can also define your own paths of execution.

## Props

When a signal is executed props can be passed into it. That means every action in the defined signal has access to these props. For example we trigger a signal:

```js
someSignal({
  foo: 'bar'
})
```

Now the whole flow of execution has access to **props.foo**. With operators and also inside your custom actions you have access to these props.

```js
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default [
  set(state`foo`, props`foo`)
]
```

## Actions

An action is just a function. What makes an action different from a normal function though is that it receives only one argument, created by Cerebral. It is called the **context**. Actions are "low level" and imperative. There is no declarative code without some imperative code behind it. In Cerebral most of the imperative action code is already written for you, but sometimes you need to write custom logic. That is when you write your own action.

```js
function iAmAnAction (context) {

}
```

Whatever side effect you need to run, even a state change, you do it from the context. It means you do not need any API to define an action or import any other modules to define business logic. This makes actions highly testable and easy to write.

Here is an example of an action changing the state of the application:

```js
function iAmAnAction ({state}) {
  state.set('foo', 'bar')
}
```

Or using props:

```js
function iAmAnAction ({state, props}) {
  state.set('foo', props.foo)
}
```

### Update props
You update the props on the signal by returning an object from the action. This object will be merged with existing props.

```js
function iAmAnAction () {
  return {
    newProp: 'someValue'
  }
}
```

### Async
When actions return a promise the signal will hold execution until it is resolved. any resolved values will be merged in with props.

```js
function iAmAnAction () {
  return new Promise((resolve) => {
    resolve({
      newProp: 'someValue'
    })
  })
}
```

### Paths
If an action is defined with paths in a signal, these paths will be available in the action.

```js
[
  isAwesome, {
    true: [],
    false: []
  }
]
```

Since this action is followed by a paths definition, you have access to these paths inside the **isAwesome** action.

```js
function isAwesome ({state, path}) {
  if (state.get('isAwesome')) {
    return path.true()
  }

  return path.false()
}
```

You now call the path as defined, and you can optionally pass it an object which will be merged with the current props. Make sure you **return** the path from the action!

## Parallel execution
You can run actions in parallel. You do that by using the **parallel** function:

```js
import {parallel} from 'cerebral'

function actionA () {...}
function actionB () {...}
function actionC () {...}

export default [
  parallel([
    actionA,
    actionB
  ]),
  actionC
]
```

If *actionA* returns a promise *actionB* will still be run instantly, meaning that they run in parallel. When both *actionA* and *actionB* is done, *actionC* is run.

## Composing
Actions and a sequence of actions can be composed into other sequences of actions. This is a powerful concept that allows you to decouple a lot of your logic and compose it together wherever it is needed:

```js
import otherActions from './otherActions'

function actionA () {}
function actionB () {}

export default [
  actionA,
  otherActions, // [actionC, actionD, actionE]
  actionB
]
```

Cerebral will now run this as one signal, first running *actionA*, then whatever is expressed in *otherActions* and then run *actionB* last. The debugger will even show otherActions as its own sequence of actions, meaning that composition is visualized in the debugger. If you want you could even name this otherActions sequence, giving even more debugging information.

*otherActions.js*
```js
import {sequence} from 'cerebral'

function actionC () {}
function actionD () {}
function actionE () {}

export default sequence('otherActions', [
  actionC,
  actionD,
  actionE
])
```
