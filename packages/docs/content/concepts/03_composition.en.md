---
title: Composition
---

## Composition

Composition is a general term. With code it has two practical meanings.

1. Creating functions that can be composed

2. Composing functions

Typically we think of composition in functional programming. Like when you:

```js
 const namesUpperDashSeparated = (
   somePeople
    .map(take('name'))
    .map(toUpperCase)
    .reduce(dashSeparated, '')
 )
```

Here we define functions that can be composed in many different scenarios. We compose using the array chaining of methods. So the functions defined are compatible with this type of composition.

Cerebral signals are also composable, but not with chaining like an array.

### Create a signal compatible function (action)
Like the **toUpperCase** function above requires the input to be a string, so does signal functions have requirements. There are basically three rules.

**1**. The function should operate on the **context** argument

```js
function someAction({input, state, path}) {
  // Can only operate on what is passed on context
}
```

**2**. Any returned value from the function needs to be an object. This is because it needs to be merged with the existing input

```js
function someAction() {
  return {foo: 'bar'}
}
```

**3**. Any async behaviour requires the function to return a promise or be defined as an async function

```js
function someAction() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

async function someAction() {
  const data = await getData()

  return {data}
}
```

### Compose
You have already seen examples of composition. Defining a signal is composition by default.

```js
[
  doThis,
  doThat
]
```

Both **doThis** and **doThat** can be used in any other signal as well. But not only actions can be composed into a signal, also chains can be composed into signals.

So lets say you have two different chains fetching some data and updating some state. You can compose these into one signal with:

```js
[
  ...fetchThis,
  ...fetchThat
]
```

Since both **fetchThis** and **fetchThat** are chains (arrays) they can be merged into the same chain using the spread operator. The code above actually looks something like:

```js
[
  fetchThis, {
    success: [],
    error: []
  },
  fetchThat, {
    success: [],
    error: []
  }
]
```
