# cerebral-module-shortcuts

## install

**NPM**

`npm install cerebral-module-shortcuts@next --save --save-exact`

**YARN**

`yarn add cerebral-module-shortcuts@next --exact`

## description
This is a tiny module that allows you to bind keyboard shortcuts to Cerebral 2 signals.

It's created using a very nice library called ["shortway" by Thiago Santos](https://github.com/thiamsantos/shortway) 

## example usage

```javascript

import shortcuts from 'cerebral-module-shortcuts';

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