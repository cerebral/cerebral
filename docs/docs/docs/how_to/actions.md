# Create actions

A signal runs actions and actions are actually just functions.

```js
function iAmAnAction () {}
```

That means you do not need any API to define an action. This makes actions highly testable.

Typically you use actions to change the state of the application or run other side effects.

```js
function iAmAnAction ({props, state}) {
  state.set('some.path', props.someValue)
}
```

```js
function iAmAnAction ({http, path}) {
  return http.get('/someitems')
    .then(path.success)
    .catch(path.error)
}
```

## Update props
You update the props on the signal by returning an object form the action. This object will be merged with existing props.

```js
function iAmAnAction () {
  return {
    newProp: 'someValue'
  }
}
```

## Async
When actions return a promise the signal will hold execution until it is resolved. any resolved values will be merged in with props.

```js
function iAmAnAction () {
  return new Promise((resolve) => {
    resolve({
      newProp: 'someValue'
    })
  })
}
```
