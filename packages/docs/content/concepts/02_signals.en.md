---
title: Signals
---

## Signals

The signals of Cerebral is named in past tense. So typically you would name a signal **inputChanged** or **mounted**. You call a signal just like you would call a function, the difference is that you start an execution of one or multiple functions. Let us look at an example and talk about what is happening, and why.

```js
export default [
  function setFooToBar({state}) {
    state.set('foo', 'bar')
  }
]
```

Cerebral uses the [function-tree](https://github.com/cerebral/function-tree) project to implement its signals. A function-tree allows you to define a tree of functions to be executed. In Cerebral world we call the arrays in a function-tree **chains**. These chains contains functions, we call them **actions**. So to sum up, signals are chains of actions.

The first action in the chain above is defined inline. When the signal is called the function will be run and a **context** will be passed to it. This context holds everything the action wants to do, it being state updates, talking to the server or whatever else. What is available on the context is defined when you configure your Cerebral application.

This means defining a signal in Cerebral does not use any APIs. You only define plain functions, arrays and later you will see objects. That means everything related state updates and other side effects will be provided when the signal runs. This decoupling makes it very easy to test actions and also the whole signal.

### Factories
Factories is a general concept that is heavily used in Cerebral. Let us say that you wanted a generic **set**.

```js
function setFactory(path, value) {
  function set({state}) {
    state.set(path, value)
  }

  return set
}

export default [
  set('foo', 'bar')
]
```

With this factory in place you could change the path and the value to set without defining new functions. This is such a useful concept that Cerebral has a concept of **operators** built in:

```js
export default [
  set('state:foo', 'bar')
]
```

As you can see you set a "state" target. This hints to operators being a bit more powerful than plain factories. You can read more about them in the API section.

### Async
Updates to state often requires other side effects to be run and very often these side effects are async. Typically you need to get some data from the server.

```js
function getData({axios}) {
  return axios.get('/data')
    .then(response => ({result: response.data}))
    .catch(error => ({error: error.response.data}))
}

export default [
  getData
]
```

To define async execution of an action you simply return a promise from it. You could also use **async function** here. In this example we use the [axios](https://github.com/mzabriskie/axios) project. It has been available to all actions in the configuration of the application. When you want to return a result from an action it has to be an object. This object will be merged into what we call the **input**.

### Input
When you trigger a signal you can pass it an object. This will be the input of the signal and it is available on all actions.

```js
someSignal({
  foo: bar
})

[
  function someAction({input}) {
    input.foo // "bar"
  }
]
```

With the example above, where we returned an object from **getData**, the next action would have **result** available to it if it was a success:

```js
function getData({axios}) {
  return axios.get('/data')
    .then(response => ({result: response.data}))
    .catch(error => ({error: error.response.data}))
}

function setData({input, state}) {
  state.set('data', input.result)
}

export default [
  getData,
  setData
]
```

You can return an object from whatever action you want, it being async or not. But **getData** might return either a result or an error. How would we handle the error? This is where we introduce paths, which is part of function-tree.

### Paths
The **getData** action above caught an error and we would like to diverge the execution of the signal down a different path than if it succeeds. Let us change the code a bit:

```js
function getData({axios, path}) {
  return axios.get('/data')
    .then(response => path.success({result: response.data}))
    .catch(error => path.error({error: error.response.data}))
}

export default [
  getData, {
    success: [
      copy('input:data', 'state:data')
    ],
    error: [
      copy('input:error', 'state:error')
    ]
  }
]
```

We used an object to define possible execution paths to take. Since **getData** now can choose a path to take, the **path** property is now available on the context passed to it. The path already knows what possible paths can be taken and therefor has a **success** and an **error** method available. Note that these names could be anything. This is **not** about throwing errors. This is about choosing a path of execution.

The paths could also be:

```js
export default [
  getData, {
    success: [
      copy('input:data', 'state:data')
    ],
    notFound: [],
    notAuthenticated: [],
    error: [
      copy('input:error', 'state:error')
    ]
  }
]
```

The point is that execution paths are important. Running a flow is not about one "happy path" and throwing errors. It can be many things:

```js
[
  whenUserRole, {
    admin: [],
    user: [],
    otherwise: []
  }
]
```

```js
[
  isAwesome, {
    true: [],
    false: []
  }
]
```

### Summary
Signals is an abstraction that allows you to completely decouple your functions, but still compose them together as one coherent flow. That means we make your functions pure, even though they run side effects. This gives you testability out of the box. On top of this the debugger will understand everything that is happening inside your application building the mental image of how a signal actually ran. This is a great tool to bring new people into the code and debug where things go wrong.
