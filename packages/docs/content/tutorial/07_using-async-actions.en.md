---
title: ch06. Async actions
---

## Async actions

[Preview](06)

Run script from the command line to start:
`npm run start:ch 06`

Until now we have mostly used synchronous actions inside our **signals** and the flow was therefore straightforward. Example:

```js
{
  somethingHappened:[
    action1,
    action2
  ]
}
```
Because action2 appears after action1, action1 finishes before action2 starts. Clear enough. But now what happens when action1 executes asynchronously?

We already have an example of this in our code. The **wait** operator runs asynchronously. It runs for 4 seconds before the toast message is reset.

```js
{
  buttonClicked:[
    set(state`toast`, input`message`),
    ...wait(4000, [
      set(state`toast`, null)
    ])
  ]
}
```

The signal executes with the same behaviour, it waits for an action to resolve before moving to the next. Let us look at how **wait** is defined:

```js
function waitFactory (ms, continueChain) {
  function wait ({path}) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(path.timeout()), ms)
    })
  }

  return [
    wait, {
      timeout: continueChain
    }
  ]
}
```

We have just created a **factory**. A function that returns an action. The action itself (wait) returns a promise. This promise is what tells the signal to hold its execution until it is resolved.

Cerebral factories are not only restricted to actions, you can also have chain factories. Let us create our own custom **showToast** chain factory.

Instead of returning am action, we return a chain. As you can see we have moved the actions we defined previously into this array, using the arguments passed into the factory.

```js
...
function showToast(message, ms) {
  return [
    set(state`toast`, message),
    ...wait(ms, [
      set(state`toast`, null)
    ])
  ]
}
...
const controller = Controller(...)
```

We need to adjust *src/index.js*:
```js
{
  buttonClicked: [
    ...showToast(input`message`, 1000)
  ]
}
```

Again since **showToast** returns a chain we use the spread operator to merge into into our existing chain.

Congratulations! You have successfully mastered the power of factories. But there are couple of more concepts that will help you define state changes, jump over to the next chapter to find out more.
