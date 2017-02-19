# Update state

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/#/bins/-KdBGyGo09NxQfRWSNOb)

Defining state and user interfaces is more about describing how something should look, rather than how it should update. Updates are the tricky part, this is where we usually introduce complexity in our applications.

Cerebral allows you to describe updates the same way you describe state and user interfaces, in a declarative manner. We call them **signals** and they will help you handle complexity both in code and in your head.

## Adding a signal
Let us add a signal to our Controller in **controller.js**:

```js
...
function updateSubtitle ({state}) {
  state.set('subTitle', 'Updating some state')
}

const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management'
  },
  signals: {
    buttonClicked: [
      updateSubtitle
    ]
  }
})
```
We now defined a signal named **buttonClicked**. The signal tells us "what happened to make this signal run". A signal is defined using an array containing functions. What we want to happen when this signal triggers is to update the **subTitle** in our state with a static value. We do this by pointing to our *subTitle* function, making it an item of the array. Normally you would define this function in a separate file. The **updateSubtitle** function is one of possibly multiple functions that will run when **buttonClicked** runs.

As you can see functions in a signal receives an argument, which we [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to grab the *state*. The argument itself is called the **context**. So **state** is on the **context**, as we can see here:

```js
...
function updateSubtitle ({state}) {
  state.set('subTitle', 'Updating some state')
}
...
```

## Trigger the change
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
As you can see the App-Component depends on **subTitle**. That means it will render automatically whenever **subTitle** changes. Because our **updateSubtitle** function changes the path **subTitle**, Cerebral just knows which components need to update and thus there is no dirty checking or other value comparison needed.

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
