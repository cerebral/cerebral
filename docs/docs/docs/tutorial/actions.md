# Actions

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/#/bins/-KdBPZwKFDQKkAcUqRte)

Signals can take a props-object which can be further processed by its actions.

Let us say you have a user input which should get written to state.
As we now know, the only correct way to write to state is to use **signals** with **actions**.

Just like we grabbed the **state** from the context of an action, we can also grab the **props**. This props object can be populated when a signal triggers and it can also be extended by actions. Any object returned from an action will be merged into the current props and passed to the next action.

## Create an action
Let us create a new action that will take a prop from the signal and add some exclamation marks.

```js
function shoutIt ({props}) {
  return {
    message: `${props.message}!!!`
  }
}
```

As you can see we grabbed the props just like we grabbed the state. The object we return from the action will be merged with the existing props. That means we are overriding the **message** with exclamation marks.

On our first **set** operator we rather now use a tag, *props*, to define that we want to set the message from the props.

```js
...
import {set, wait} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
...
{
  buttonClicked: [
    shoutIt,
    set(state`toast`, props`message`),
    wait(4000),
    set(state`toast`, null)
  ]  
}
```

## Passing a payload
Now we just need to change our button click to actually pass a message:

*App.js*
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
  function App ({title, subTitle, buttonClicked}) {
    return (
      <div>
        <h1>{title}</h1>
        <h3>{subTitle}</h3>
        <button onClick={() => buttonClicked({
          message: 'Please shout me'
        })}>
          Update state
        </button>
        <Toast />
      </div>
    )
  }
)
```

Now we are ready to test drive our changes. Click the button and you should see the toast message appear with three exclamation marks behind. Please keep an eye on the **debugger**. You can track how the flow of the props between the actions as they execute. Keep in mind that the result object from an action will be merged with the props and handed over to the next action. You might just as well used a different property for the shouted message.

## Challenge

- Add another custom action which transforms the props value to Uppercase. You may override existing properties on the props or create a new one

If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
