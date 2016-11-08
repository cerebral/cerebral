---
title: Using chains 
---

## 6: Using chains 

`npm run ch05`


A signal can trigger a chain of actions. For now we have seen it trigger the **set**-action.
Let us add another preconfigured action named **wait** and another **set** to close our toast message after a few seconds. So go ahead and change our **buttonClicked-Signal** in *src/index.js* to execute a 2 more actions:
```js
    ...
    buttonClicked: [
      set(state`toast.message`, 'Button Clicked!'),
      wait(4000),
      set(state`toast.message`, '')
    ]
    ...
```
And don't forget to import the **wait**-operator:
```js
import { set, state, wait } from 'cerebral/operators'
```
Now when we check again in the debugger you will see all the 3 actions executed when signal *buttonClicked* got triggered.

This maybe makes the impression that there will be a lot to type. But you have to know that you can reuse those chains if you like.

Still speaking of the debugger did you notice the **Input: {}** in front of every action executed? Looks quite empty. Let us change that!


