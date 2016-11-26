---
title: Operators
---

## Operators

Everything that happens in a signal is based on actions. But these actions can be dynamic, in the sense that you rather call a function with some parameters and based on those parameters creates a function for you. This is what operators is all about.

For example:

```js
import {wait} from 'cerebral/operators'

export default [
  wait(200), {
    continue: []
  }
]
```

The *wait* function returns an action based on the parameter passed in. Let us look at how it is implemented.

```js
function waitFactory (ms) {
  function wait ({path}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(path.continue())
      }, ms)
    })
  }

  return wait
}
```

So operators are quite simple as you can see. A more generic term is *action factories*, which you most certainly will take advantage of in your own application. So operators are really the core *action factories* of Cerebral.

### Operators tags
JavaScript ES2015 has gotten a lot of nice features. One of these feature is template strings.

```js
const name = 'Bob'

`Hello there ${name}` // Hello there Bob
```

But a not very well known feature of template strings is [template tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). We use this functionality in Cerebral to empower both the core action factories (operators), but also any action factories you might come up with.

This is how typical usage of operators tags look:

```js
import {state, set} from 'cerebral/operators'

export default [
  set(state`foo.bar`, 'baz')
]
```

When the following code runs...

```js
state`foo.bar`
```

...it will return a function. This function can be used inside action factories to grab details.

```js
function someFactory(statePath) {
  function someAction (context) {
    // We pass the context to the operator tag
    const statePathTemplate = statePath(context)

    statePathTemplate.target // "state"
    statePathTemplate.path // "foo.bar"
    statePathTemplate.value // The value on path "foo.bar" in state tree

  }

  return someAction
}
```

So an operator tag has a **target** which can be used identify some logic you want to run. The **path** is the evaluated path on the operator tag. The **value** is any extracted value of the operator tag.

You can easily create your own action factories and use the operator tags. Here showing the implementation of **set**

```js
function setFactory(target, value) {
  function set(context) {
    // Returns an object with type of operator tag, the path
    // it resolves to and any value it resolves to. So given
    // state {foo: 'bar'}, the operator tag: state`foo` resolves
    // to {target: 'state', path: 'foo', value: 'bar'}
    const targetTemplate = target(context)

    // We now check if the target is correct
    if (targetTemplate.target !== 'state') {
      throw new Error('You have to target state when merging')
    }

    // Since we allow both using an operator tag or a hardcoded value
    // we check if it is a function, which means it is an operator tag.
    // Then we either grab the value from the operator tag or the value
    // passed in
    const setValue = typeof value === 'function' ? value(context).value : value

    context.state.set(targetTemplate.path, setValue)
  }

  return set
}
```

Custom operators often wants to extract paths, though not necessarily related to state or input. That is why we have operator tag **string**.

```js
import {string} from 'cerebral/operators'
import showMessage from '../factories/showMessage'
import starsCount from '../computeds/starsCount'
[
  showMessage(string`There are ${starsCount} left`)
]
```
