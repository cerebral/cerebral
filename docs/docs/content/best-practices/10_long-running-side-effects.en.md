---
title: Long running side effects
---

## Long running side effects

Most *signals* in your application are triggered by users interacting with the UI-- typing in an input, submitting a form, or closing a modal window. But, many times your application needs to respond to events from the "outside" world. These could be websocket messages from services like Firebase, chat messages from your backend, or even simple HTTP long polling for data.

In Cerebral, these processes can be encapsulated in a provider.

#### An HTTP Polling Provider

Lets imagine you have a navbar component which should the current count of messages. Let us first implement the provider and then see how it can be used:

```js
function HttpPoller (options = {}) {
  let cachedProvider = null

  function createProvider ({http, controller}) {
    return {
      start (url, frequencyMs, signalPath) {
        http.get(url)
          .then((result) => {
            controller.getSignal(signalPath)(result)
            setTimeout(this.start.bind(this, url, frequencyMs, signalPath), frequencyMs)
          })
      }
    }
  }

  return (context) => {
    context.httpPoller = cachedProvider = cachedProvider || createProvider(context)

    if (context.debugger) {
      context.debugger.wrapProvider('httpPoller')
    }

    return context
  }
}
```

This is a very simple implementation that shows you how to trigger signals from within a provider. The poller should also have the possibility to stop polls of course.

#### Defining the Action

Lets use the **httpPoller** service in our action:

```js
function pollMessageCounts({state, httpPoller}) {
  const id = state.get('currentUser.id');

  httpPoller.start(`/api/message_counts/${id}`, 'navbar.messageCountsFetched')
}
```

#### With signals now

Now we can implement our signals and their corresponding action chains in our **navbar** module and define our component:

*src/modules/navbar/index.js*
```js
import {input, set} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import pollMessageCounts from './actions/pollMessageCounts'

export default {
  state: {
    messageCounts: 0
  },
  signals: {
    mounted: [
      pollMessageCounts
    ],
    messageCountsFetched: [
      set(state`navbar.messageCounts`, input`result`)
    ]
  }
}
```
