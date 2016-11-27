---
title: Feedback messages
---

## Feedback messages

Feedback messages, snackbars, popups etc. There are many names and approaches to how you give users feedback about what they are doing in your application, and maybe more importantly if something goes wrong. These feedback messages can actually be surprisingly complex. The reason is that you do not know when the next message will appear. Maybe showing the first one is not done yet... what should happen? Should it overwrite the current message, but what about the timing? Should it extend the timing of showing that message? Or maybe you want to display the messages on top of the other messages?

We are going to explore how we can solve these scenarios using Cerebral.

### A simple feedback message
Let us add a state for showing the message first in our **App** module:

```js
export default {
  state: {
    feedbackMessage: null
  }
}
```

Now let us create a chain factory we can compose into any other chain to display this message.

```js
import {state, set, wait} from 'cerebral/operators'

function showMessage (message) {
  return [
    set(state`app.feedbackMessage`, message),
    wait(5000),
    set(state`app.feedbackMessage`, null)
  ]
}

export default showMessage
```

We can now compose this chain into another chain, for example doing a request:

```js
import getSomething from '../actions/getSomething'
import setSomething from '../actions/setSomething'
import feedbackMessage from '../factories/feedbackMessage'

export default [
  getSomething, {
    success: [
      setSomething,
      ...feedbackMessage('Fetched something!')
    ],
    error: [
      ...feedbackMessage('Failed fetching something :(')
    ]
  }  
]
```
But we have an issue here. What if two message appear within 5 seconds? What if another one is triggered after 4 seconds? It will change the text, but after 1 second it will close... instead of waiting a new 5 seconds. And after another 4 seconds it will try to close it again, without needing to.

Let us see how we can make this better.

### Debouncing
We can use debouncing instead.

```js
import {state, set, debounce} from 'cerebral/operators'

// We first create a shared debounce. The benefit
// of this is that any use of this showMessage factory
// in any signal will then cancel out existing debounces
const showMessageDebounce = debounce.shared()

function showMessage (message) {
  return [
    set(state`app.feedbackMessage`, message),
    showMessageDebounce(5000), {
      continue: [
        set(state`app.feedbackMessage`, null),
      ],
      discard: []
    }
  ]
}

export default showMessage
```

Now we have essentially fixed the problem. If again a new message triggers after 4 seconds, the debounce will discard the first one. If no new messages trigger during 5 seconds it will close the message, or if a new one appears it will again replace the text, discard the previous and wait 5 seconds to close.

### Multiple messages
What if we wanted to stack messages on top of each other if there were messages there already?

First let us change our state to handle multiple messages:

```js
export default {
  state: {
    feedbackMessages: []
  }
}
```

And now let us rather unshift a new message to the array, then remove all messages when 5 seconds has passed.

```js
import {state, set, unshift, debounce} from 'cerebral/operators'

const showMessageDebounce = debounce.shared()

function showMessage (message) {
  return [
    unshift(state`app.feedbackMessages`, message),
    showMessageDebounce(5000), {
      continue: [
        set(state`app.feedbackMessages`, [])
      ],
      discard: []
    }
  ]
}

export default showMessage
```

So now as long as we are showing messages we will stack them on top of each other. When 5 seconds has passed without any new messages it will close and clear out all messages.
