# Actions

**Load up chapter 05** - [Preview](05)

Signals can take an input-object which can be further processed by its actions.

Let us say you have a user input which should get written to state.
As we now know, the only correct way to write to state is to use **signals** with **actions**.

Just like we grabbed the **state** from the context of an action, we can also grab the input. This input object can be populated when a signal triggers and it can also be extended by actions. Any object returned from an action will be merged into the current input and passed to the next action.

## Create an action
Let us create a new action that will take an input to the signal and add some exclamation marks.

```js
function shoutIt ({input}) {
  return {
    message: `${input.message}!!!`
  }
}
```

As you can see we grabbed the input just like we grabbed the state. The object we return from the action will be merged with the existing input. That means we are overriding the **message** with exclamation marks.

On our first **set** operator we rather now use a tag, *input*, to define that we want to set the message from the input.

```js
...
import {set, wait} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'
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

## Passing a payload
Now we just need to change our button click to actually pass a message:

*src/components/App/index.js*
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import Toast from './Toast'

export default connect({
  title: state`title`,
  subTitle: state`subTitle`,
  buttonClicked: signal`buttonClicked`
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

Now we are ready to test drive our changes. Click the button and you should see the toast message appear with three exclamation marks behind. Please keep an eye on the **debugger**. You can track how the flow of the input between the actions as they execute. Keep in mind that the result object from an action will be merged with the input and handed over to the next action. You might just as well used a different property for the shouted message.

## Challenge

- Add another custom action which transforms the input value to Uppercase. You may override existing properties on the input or create a new one

**Want to dive deeper?** - [Go in depth](../in_depth/actions.md), or move on with the tutorial
