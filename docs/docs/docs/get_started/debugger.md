# Debugger

Cerebral has a powerful development tool. It knows about all the state in your application, all the state updates, side effects run, state paths currently active in your components and when they render. All the things Cerebral helps you with, it visualizes in the debugger.

The Cerebral debugger is a standalone application and a chrome extension. You can use both if you want, as the chrome extension is the fallback if the standalone debugger is not opened. You can install the chrome extension from [the google store](https://chrome.google.com/webstore/detail/cerebral2-debugger/ghoadjdodkgkbbmhhpbfhgikjgjelojc).

The standalone debugger connects to your application through websockets. You will need to configure the **devtools** for this purpose (see below). Download and extract the zip for your target OS: [Mac](https://docs.google.com/uc?id=0B1pYKovu9UpybHRMRm9YZU10WUU&export=download), [Windows](https://docs.google.com/uc?id=0B1pYKovu9UpyU0lkU2UyWklMV28&export=download) or [Linux](https://docs.google.com/uc?id=0B1pYKovu9UpyWE85UWVHNFRCQkk&export=download)

You initialize the devtools by adding it to the controller.

```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  // You do not want to run the devtools in production as it
  // requires a bit of processing and memory to send data from
  // your application
  devtools: (
    process.env.NODE_ENV === 'production' ?
      null
    :
      Devtools({
        // If running standalone debugger
        remoteDebugger: 'localhost:8585'
      })
  )
})

export default controller
```

## Signals
The signals tab in the debugger gives you a chronological list of signals triggered. Every signal tells you what actions were run, what mutations were run related to the action and what other side effects like HTTP and Firebase was triggered. You will also see how your signals are composed together in different action groups, parallel execution.

![signals](/images/signals.png)

## Mutations
The mutations tab gives you a chronological list of mutations performed. Since signals can be asynchronous, mutations might happen cross signals. In this list you can double click a mutation to time travel to that point in time.

![signals](/images/mutations.png)

## Components
The components tab gives you a list of all currently connected components in your app and what state dependencies they have. You also have a list of latest renders. This list contains what paths changed and what components was affected by the change.

![signals](/images/components.png)

## State tree
The state tree tab gives you complete overview of the state of your application. You can explore it and make changes to the state directly to see how it affects your application.

![signals](/images/state_tree.png)
