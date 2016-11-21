---
title: Devtools
---

## Devtools

Cerebral has a powerful development tool. It knows about all the state in your application, all the state updates, side effects run, state paths currently active in your components and when they render. All the things Cerebral helps you with, it visualizes in the debugger.

#### Install Chrome extension
You will need the Chrome Extension from the [chrome store](https://chrome.google.com/webstore/detail/cerebral2-debugger/ghoadjdodkgkbbmhhpbfhgikjgjelojc). When installed you will get a **Cerebral2** tab in the Chrome devtools.

#### Initialize the devtools
You initialize the devtools by adding it to the controller.

```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools()
})
```

You do not want to run the devtools in production as it requires a bit of processing and memory to send data from your application.

You can pass some options to the devtools to balance the processing and memory footprint:

```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools({
    // Time travel
    storeMutations: true,
    // Warnings on mutating outside "state" API
    preventExternalMutations: true,
    // Warnings when passing in non-serializable data to signals and state tree
    enforceSerializable: true,
    // Warnings when strict render path usage is wrong
    verifyStrictRender: true,
    // Throw error when overwriting existing input property
    preventInputPropReplacement: false,
    // Shows a warning when you have components with number of state dependencies
    // or signals above the set number
    bigComponentsWarning: {state: 5, signals: 5}
  })
})
```

Turning these options to false will free up memory and CPU. Typically this is not an issue at all, but if you work with data heavy applications it might make a difference.
