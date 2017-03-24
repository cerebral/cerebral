# Devtools
You can pass some options to the devtools to balance the processing and memory footprint:

```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools({
    // Connect to Electron debugger (external debugger). It will
    // fall back to chrome extension if unable to connect
    remoteDebugger: 'localhost:8585',

    // Time travel
    storeMutations: true,

    // Warnings on mutating outside "state" API
    preventExternalMutations: true,

    // Shows a warning when you have components with number of
    // state dependencies or signals above the set number  
    bigComponentsWarning: 5,

    // In addition to these basic JavaScript types: Object, Array, String, Number
    // and Boolean, types of File, FileList, Blob, ImageData and RegExp is allowed to be stored in state
    // tree. You can add additional types if you know what you are doing :)
    allowedTypes: [
     Blob
    ]
  })
})
```

Turning these options to false will free up memory and CPU. Typically this is not an issue at all, but if you work with data heavy applications it might make a difference.
