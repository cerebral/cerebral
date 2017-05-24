# @cerebral/shortcuts

## install

**NPM**

`npm install @cerebral/shortcuts --save`

**YARN**

`yarn add @cerebral/shortcuts`

## description
This is a tiny module that allows you to bind keyboard shortcuts to Cerebral signals.

It's created using a very nice library called ["shortway" by Thiago Santos](https://github.com/thiamsantos/shortway)

## example usage

```javascript

import shortcuts from '@cerebral/shortcuts';

const controller = Controller({
  signals: {
    testSignal: () => console.log("shortcut pressed!")
  },
  modules: {
    shortcuts: shortcuts({
      "ctrl+s": "testSignal"
    })
  },
  devtools: process.env.NODE_ENV === "production"
    ? null
    : Devtools({
        // If running standalone debugger. Some environments
        // might require 127.0.0.1 or computer IP address
      remoteDebugger: "localhost:8585"
    })
});

```
