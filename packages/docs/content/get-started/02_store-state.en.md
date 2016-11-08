---
title: Store State
---

## 2: Store State

All interactive user interfaces are using **state** in a way or another. Cerebral stores this state in a single model. The model holds the description of the state your application is in, and it also holds any data downloaded from the server. Since Cerebral uses a single model the debugger can visualize the whole state description of the application. 

All we need to do is to add a state object to our **Controller** in *src/index.js* 

```js
...
const controller = Controller({
  state: {
    title: 'Hello from Cerebral!'
  }
})
...
```

Thats it!
You can check the state now with the cerebral-debugger if you want.

*Running into problems with the code? Then please just do a* `npm run ch02` *in your console*

