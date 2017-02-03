# Async actions

**Load up chapter 06** - [Preview](06)

Until now we have mostly used synchronous actions inside our **signals** and the flow was, therefore, straightforward. Example:

```js
Controller({
  signals: {
    somethingHappened:[
      action1,
      action2
    ]
  }
})
```
Because action2 appears after action1, action1 finishes before action2 starts. Clear enough. But now what happens when action1 executes asynchronously?

We already have an example of this in our code. The **wait** operator runs asynchronously. It runs for 4 seconds before the toast message is reset.

```js
Controller({
  signals: {
    buttonClicked:[
      set(state`toast`, input`message`),
      wait(4000),
      set(state`toast`, null)
    ]
  }
})
```

The signal executes with the same behavior, it waits for an action to resolve before moving to the next. So how does Cerebral know that **wait** is an asynchronous action? Well, the action returns a promise. That means all actions returning a promise is considered an *async action*.

## Creating factories
Let us look at how **wait** is defined:

```js
function waitFactory (ms) {
  function wait () {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  return wait
}
```

We have just defined a **factory**. A function that returns an action. The action itself (wait) returns a promise. This promise is what tells the signal to hold its execution until it is resolved.

Cerebral factories are not only restricted to actions, you can also have chain factories.

## Chain factories
Let us create our own custom **showToast** chain factory. Instead of returning an action, we return a chain. As you can see we have moved the actions we defined previously into this array, using the arguments passed into the factory.

```js
...
function showToast(message, ms) {
  return [
    set(state`toast`, message),
    wait(ms),
    set(state`toast`, null)
  ]
}
...
const controller = Controller(...)
```

We need to adjust *src/index.js*:
```js
Controller({
  signals: {
    buttonClicked: [
      ...showToast(input`message`, 1000)
    ]
  }
})
```

Since **showToast** returns an array we use the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) to merge into our existing chain.

Congratulations! You have successfully mastered the power of factories. But there are a couple of more concepts that will help you define state changes, jump over to the next chapter to find out more.
