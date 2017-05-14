# Signals

You trigger a signal when something happens in your application. For example a button is clicked, but also if a websocket connection receives a message. The signal runs the business logic of your application. You compose together state changes, side effects and other logic in one coherent flow. The signals of Cerebral are named in past tense. So typically you would name a signal **inputChanged** or **mounted**. Going through this guide you will see what benefits this approach gives you. To trigger a signal you call it just like you would call a function, the difference is that you start a function-tree execution.

Cerebral uses the [function-tree](https://github.com/cerebral/function-tree) project to implement its signals. A function-tree allows you to define a tree of functions to be executed. In Cerebral world we call the functions in this tree **actions**.

You can define this execution tree with a single action:

```js
function myAction () {}

export default myAction
```

Or you can group them together in a *sequence* using an array:

```js
function actionA () {}
function actionB () {}

export default [
  actionA,
  actionB
]
```

In a sequence Cerebral runs one action after the other synchronously. When an action returns a promise it will hold until the promise resolves and then continue the sequence.

## Parallel execution
You can also run these actions in parallel. You do that by using the **parallel** function:

```js
import {parallel} from 'cerebral'

function actionA () {}
function actionB () {}
function actionC () {}

export default [
  parallel([
    actionA,
    actionB
  ]),
  actionC
]
```

If actionA returns a promise actionB will still be run instantly, meaning that they run in parallel. When both actionA and actionB is done, actionC is run.

## Composing
Actions and a sequence of actions can be composed into other sequences of actions. This is a powerful concept that allows you to decouple a lot of your logic and compose it together wherever it is needed:

```js
import otherActions from './otherActions'

function actionA () {}
function actionB () {}

export default [
  actionA,
  otherActions,
  actionB
]
```

Cerebral will now run this as one signal, first running *actionA*, then whatever is expressed in *otherActions* and then run *actionB* last. The debugger will even show otherActions as its own sequence of actions, meaning that composition is visualized in the debugger. If you want you could even name this otherActions sequence, giving even more debugging information.

## Running a signal
To run a signal you can grab it from the controller:

```js
import {Controller} from 'controller'
import someActions from './actions/someActions'

const controller = Controller({
  signals: {
    somethingHappened: someActions
  }
})

const signal = controller.getSignal('somethingHappened')
signal()
```

This signal triggers synchronously and you can pass it a payload.

```js
// ...
signal({
  foo: 'bar'
})
```

This payload is brought into the signal execution and acts as the **props** of the signal. Typically you will not trigger signals manually this way, but rather from within a component.

```js
// ...
import {signal} from 'cerebral/tags'

connect({
  somethingHappened: signal`app.somethingHappened`
},
  function MyComponent (props) {
    return <button onClick={() => props.somethingHappened()}>Click me</button>
  }
)
```

The payload passed to a signal is typically the core value types of JavaScript. Object, Array, String, Number or Boolean. It is also possible to pass in some special value types, like files. For a full list of supported value types, check the [state API documentation](../api/state.md).

## Tutorial
**Before you start,** [load this BIN on Webpackbin](https://www.webpackbin.com/bins/-KdBGyGo09NxQfRWSNOb)

Defining state and user interfaces is more about describing how something should look, rather than how it should update. Updates are the tricky part, this is where we usually introduce complexity in our applications.

Cerebral allows you to describe updates the same way you describe state and user interfaces, in a declarative manner. We call them **signals** and they will help you handle complexity both in code and in your head.

### Adding a signal
Let us add a signal to our **Controller** in *controller.js*:

```js
...
function updateSubtitle ({state}) {
  state.set('subTitle', 'Updating some state')
}

const controller = Controller({
  devtools:  Devtools({
    remoteDebugger: '127.0.0.1:8585'
  }),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management'
  },
  signals: {
    buttonClicked: updateSubtitle
  }
})
...
```
We now defined a signal named **buttonClicked**. The signal tells us "what happened to make this signal run". What we want to happen when this signal triggers is to update the **subTitle** in our state with a static value. We do this by pointing to our *subTitle* function. Normally you would define this signal in a separate file.

As you can see functions in a signal receives an argument, which we [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to grab the *state*. The argument itself is called the **context**. So **state** is on the **context**, as we can see here:

```js
...
function updateSubtitle ({state}) {
  state.set('subTitle', 'Updating some state')
}
...
```

### Trigger the change
Please take a closer look at *App.js*:

```js
...
connect({
  title: state`title`,
  subTitle: state`subTitle`
},
  ...
)
```
As you can see the App-Component depends on **subTitle**. That means it will render automatically whenever **subTitle** changes.

To trigger the signal we need to wire up a click-handler on a button and add our signal **buttonClicked** to the **connect(..)** method:

*App.js*
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'

export default connect({
  title: state`title`,
  subTitle: state`subTitle`,
  buttonClicked: signal`buttonClicked`
},
  function App ({title, subTitle, buttonClicked}) {
    return (
      <div>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
        <button onClick={() => buttonClicked()}>
          Update state
        </button>
      </div>
    )
  }
)
```
Now click it and take a look at the debugger. You will see the debugger list the execution of the signal, with information about what happened. This is also a tool the Cerebral debugger provides to give you insight into your application. Very handy for example when you need to dig into a **complex application** after not touching it for a long time, introduce a new team member to the application or debug complex execution flows.

So changing the *subTitle* is kind of a silly state change on a button click. Let's introduce a very simple "Toast"-Component. It has already been added for you on the next chapter.

If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
