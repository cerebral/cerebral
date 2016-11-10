---
title: Using simple async actions
---

## 9: Using simple async actions

`npm run ch08`

Until now we were just using synchronous actions inside our **Signals** and the flow was therefore straightforward. Example:
```js
signals:
test:[
action1,
action2,
...
]
```
Because action2 depends on the outcome of action1, action1 needs to be finished before action2 starts. Clear enough. But now what happens when action1 executes an async-task? Well let us see because we have a already a candidate in our tutorial app to test exactly this scenario.
We will simplify:
```js
      ...
      set(state`toast.message`, 'Button Clicked!'),
      wait(4000),
      set(state`toast.message`, '')
      ...
```
to:
```js
      ...
      showToast('Button Clicked!',1000),
      set(state`toast.message`, '')
      ...
```
**showToast(..)** is a so called **Factory**. A simple Version of it could look like this:

```js
function showToast(message, milliseconds) {
  function action({input, state, path}) {
    let msg = message || input.value
    let ms = milliseconds
    if (!ms)
      ms = 8000
    state.set('toast.message', msg)
    return new Promise(function(resolve, reject) {
      window.setTimeout(function() {
        resolve({})
      }, ms)
    })
  }
  action.displayName = "showToast"
  return action
}
```
Now the tutorial should run using a bit less code.
You have maybe recognised that we still reset the *toast.message* after the *showToast(..)* call. There is a reason for that. **Cerebral** is batching changes inside chains of actions so it is not a good idea to change state from within an async-function.

But we can again simplify it by adjusting the showToast-**Factory** to:
```js
...
return [action,
    set(state`toast.message`, '')
  ]
...  
```
This means now the factory returns not only the action itself but also the subsequent **set**-action which means again less code to write.

But to make it work correctly we need to [Spread...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) the result now into the **Signals** because elsewise we will end up with an array in a array which tells Cerebral to execute the actions in parallel which we don't want here.
We need to adjust the *src/index.js* like:
```js
  ...
  signals: {
    buttonClicked: [
      ...showToast('Button clicked!', 1000)
    ],
    saveButtonClicked: [
      set(state`originalValue`, input`value`),
      myAction1,
      myAction2,
      myAction3,
      set(state`extendedValue`, input`value`),
      ...showToast()
    ]
  }
  ...
```
Congratulations! You have successfully included an async action into a **Signal** without breaking the flow!
Now sometimes we would like to control the flow of async actions a bit more. To do so please head over to the next chapter were we introduce you to the world of **Path**