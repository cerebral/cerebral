# Debugger

Cerebral has a powerful development tool. It knows about all the state in your application, all the state updates, side effects run, state paths currently active in your components and when they render. All the things Cerebral helps you with, it visualizes in the debugger.

Because Cerebral can run on different environments and you might want to manage multiple apps, the debugger is a standalone application. This also opens up for further helpful tools beyond just debugging. It is an [Electron](https://electron.atom.io/) application that connects to your application through websockets. You can add multiple apps to it and if you are using function-tree on the server you can even merge execution data on client and the server.

Download and extract the zip for your target OS:

- [Download debugger for MAC](https://docs.google.com/uc?id=0B1pYKovu9UpybHRMRm9YZU10WUU&export=download)
- [Download debugger for WINDOWS](https://docs.google.com/uc?id=0B1pYKovu9UpyU0lkU2UyWklMV28&export=download)
- [Download debugger for LINUX](https://docs.google.com/uc?id=0B1pYKovu9UpyWE85UWVHNFRCQkk&export=download)

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
        // If running standalone debugger. Some environments
        // might require 127.0.0.1 or computer IP address
        remoteDebugger: 'localhost:8585',

        // By default the devtools tries to reconnect
        // to debugger when it can not be reached, but
        // you can turn it off
        reconnect: true
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
