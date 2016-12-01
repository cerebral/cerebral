---
title: ch04. Chains
---

## Chains

**Load up chapter 04** - [Preview](04)

A signal can trigger an array of functions. This array we call a **chain** and the functions we call **actions**. For now we have seen it trigger the **set**-action. In this chapter we have added a **Toast** component which displays any message set on its related state.

Let us add another operator named **wait** and another **set** to close our toast message after a few seconds. So go ahead and change our **buttonClicked** signal in *src/index.js* to execute a 2 more actions:
```js
...
import {set, state, wait} from 'cerebral/operators'
...
{
  buttonClicked: [
    set(state`toast`, 'Button Clicked!'),
    wait(4000),
    set(state`toast`, null)
  ]
}
```

Now when we check again in the debugger you will see all the 3 actions executed when signal *buttonClicked* got triggered.

Still speaking of the debugger did you notice the **Input: {}** in front of every action executed? Looks quite empty. Let us change that!
