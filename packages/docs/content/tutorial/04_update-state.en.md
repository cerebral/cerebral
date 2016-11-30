---
title: ch03. Update state
---

## Update state

**Load up chapter 03** - [Preview](03)

Defining state and user interfaces is more about describing how something should look, rather than how it should update. Updates are the tricky part, this is where we usually introduce complexity in our applications.

Cerebral allows you to describe updates the same way you describe state and user interfaces, in a declarative manner. We call them **signals** and they will help you handle complexity both in code and in your head, trying to reason about how your application works.

Let us add a signal to our Controller in **src/index.js**:

```js
import {state, set} from 'cerebral/operators'
...
...
...
const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management'
  },
  signals: {
    buttonClicked: [
      set(state`subTitle`, 'Updating some state')
    ]
  }
})
```
We now defined a signal named **buttonClicked**. The signal tells us "what happened to make this signal run". A signal is defined using an array containing functions. What we want to happen when this signal triggers is to update the **subTitle** in our state with a static value. That is why we use **set**, a Cerebral operator. Calling set will create a function for us that will put the value *Updating some state* on the state path *subTitle*. If you are unfamiliar with [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) in JavaScript, you should read about them.

Please take a closer look at *./src/components/App/index.js*:

```js
...
connect({
  title: 'title',
  subTitle: 'subTitle'
},
  ...
)
```
As you can see the App-Component depends on **subTitle**. That means it will render automatically whenever **subTitle** changes. Because we use the *set* operator to change the state at *subTitle*, Cerebral just knows which components need to update and thus there is no dirty checking or other value comparison needed.

To trigger the signal we need to wire up a click-handler on a button and add our signal **buttonClicked** to the **connect(..)** method (*./src/components/App/index.js*):

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  title: 'title',
  subTitle: 'subTitle'
}, {
  buttonClicked: 'buttonClicked'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <button
          className="c-button c-button--info c-button--block"
          onClick={() => props.buttonClicked()}
        >
          Update state
        </button>
      </div>
    )
  }
)
```
Now click it and take a look at the debugger. You will see the debugger list the execution of the signal, with information about what happened. This is also a tool the Cerebral debugger provides to give you insight into your application. Very handy for example when you need to dig into a **complex application** after not touching it for a long time, introduce a new team member to the application or debug complex execution flows.

So now changing the *subTitle* is kind of a silly state change on a button click. Let's introduce a very simple "Toast"-Component which will display our **buttonClicked** output.

**Want to dive deeper?** - [Go in depth](../in-depth/04_signals.html), or move on with the tutorial
