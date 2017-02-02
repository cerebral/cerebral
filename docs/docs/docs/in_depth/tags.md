# Tags
JavaScript ES2015 has gotten a lot of nice features. One of these feature is template strings.

```js
const name = 'Bob'

`Hello there ${name}` // Hello there Bob
```

But a not very well known feature of template strings is [template tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). We use this functionality in Cerebral to target things when you define signals, computeds and connect components.

This is how typical usage of operators tags look:

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo.bar`, 'baz')
]
```

When the following code runs...

```js
state`foo.bar`
```

...it will return a Tag. This Tag can be used inside action factories to grab details.

```js
import {Tag} from 'cerebral/tags'

function someFactory(statePath) {
  function someAction ({state, input, resolve}) {
    const isTag = resolve.isTag(statePath, 'state') // true
    const path = resolve.path(statePath) // "foo.bar"
    const value = resolve.value(statePath) // Value on "foo.bar" in state tree
  }

  return someAction
}
```

## Action factories with tags
You can easily create your own action factories and use the tags. Here showing a simple implementation of a **set**

```js
import {Tag} from 'cerebral/tags'

function setFactory(target, value) {
  function set({state, input, resolve}) {
    if (!resolve.isTag(target, 'state')  ) {
      throw new Error('You have to use STATE as set target')
    }

    // resolve.value will return tag value, computed value or plain value
    state.set(resolve.path(target), resolve.value(value))
  }

  return set
}
```

Custom operators often wants to extract paths, though not necessarily related to state or input. That is why we have the tag **string**. It will always return the evaluated string, also when using **value**.

```js
import {string} from 'cerebral/tags'
import showMessage from '../factories/showMessage'
import starsCount from '../computeds/starsCount'

function showMessage (message) {
  function showMessageAction ({state, resolve}) {
    state.set('message', resolve.value(message))
  }

  return showMessageAction
}

export default [
  showMessage(string`There are ${starsCount} left`)
]
```
