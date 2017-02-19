# Chains

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/#/bins/-KdBHyLJDefteJy0s821)

A signal can trigger an array of functions. This array we call a **chain** and the functions we call **actions**. For now, we have seen it trigger a function that changes the **subTitle** path and in this chapter, we have added a **Toast** component which displays any message set on its related state.

Creating a function for any kind of state change will be tedious. That is why Cerebral has **operators**. These operators are just functions that return an action for you. There is an operator for every kind of state change and also other operators, which will we see an example of now.

## Operators
Let us first change out our **updateSubtitle** action with an operator instead. Since we did a *set*, we change it out with the **set** operator. Operators also take advantage of the tags. In this case, the first argument uses a tag to target our state. The second argument could also have been a tag, but we hardcode a value instead.

Now lets add a **wait** operator and another **set** to close our toast message after a few seconds. So go ahead and change our **buttonClicked** signal in *src/index.js* to execute a 2 more actions:

```js
...
import {set, wait} from 'cerebral/operators'
import {state} from 'cerebral/tags'
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

Still speaking of the debugger did you notice the **Input: {}** in front of every action executed? Looks quite empty. Let us look at that in the next chapter! If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
