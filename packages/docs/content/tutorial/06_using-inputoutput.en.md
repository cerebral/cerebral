---
title: ch05. Actions
---

## Actions

**Load up chapter 05** - [Preview](05)

Signals can take an input-object which then can be further processed by its actions.

Let us say you have a user input which should get written to state.
As we now know, the only correct way to write to state is to use **signals** with **actions**. In the previous chapters we have been using operators, but now we are going to create our very own action.

An action gives us access to the input-object, among other things. This input object can be populated when a signal triggers and it can also be extended by actions. Any object returned from an action will be merged into the current input and passed to the next action. Let us change our button click to rather take an input and change it:

```js
...
import {set, state, wait, input} from 'cerebral/operators'
...
{
  buttonClicked: [
    shoutIt,
    set(state`toast`, input`message`),
    wait(4000),
    set(state`toast`, null)
  ]  
}
```

We would like to access the input-object from within our action.
So lets have a look at such a sample action. You can create on the line above the instantiation of the controller:

```js
...
function shoutIt ({input}) {
  return {
    message: `${input.message}!!!`
  }
}

const controller = Controller(...)
```
As you can see actions receives an argument, which we [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to grab the *input*. The argument itself is called the **context**. So **input** is on the **context**.

Now we just need to change our button click to actually pass a message (*src/components/App/index.js*):

```js
import React from 'react'
import {connect} from 'cerebral/react'
import Toast from './Toast'

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
          onClick={() => props.buttonClicked({
            message: 'Please shout me'
          })}
        >
          Update state
        </button>
        <Toast />
      </div>
    )
  }
)
```

Now we are ready to test drive our changes. Click the button and you should see the toast message appear with three exclamation marks behind. Please keep an eye on the **debugger**. You can track how the flow of the input between the actions as they execute. Keep in mind that the result object from an action will be merged with the input and handed over to the next action. You might just have well used a different property for the shouted message.

### Challenge

- Add another custom action which transforms the input value to Uppercase. You may override existing properties on the input or create a new one

**Want to dive deeper?** - [Go in depth](../in-depth/06_actions.html), or move on with the tutorial
