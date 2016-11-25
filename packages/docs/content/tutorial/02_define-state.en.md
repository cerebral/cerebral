---
title: ch01. Define State
---

## Define State

**Load up chapter 01** - [Preview](01)

All interactive user interfaces needs **state** in one way or another. Cerebral stores this state in something we call a **state tree**. The state tree is the description of the state your application is in. Since Cerebral uses a state tree the debugger can visualize the whole state description of the application. Normally the state of your application is hidden and decoupled deep within the code, but with Cerebral you can read it right off the debugger.

To define the initial state of the application all we need to do is to is add it to our **Controller** in *src/index.js*

```js
...
const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!'
  }
})
...
```

Thats it! The application should automatically reload and you will see this state in the Chrome debugger.


**Want to dive deeper?** - [Go in depth](../in-depth/03_state.html), or move on with the tutorial
