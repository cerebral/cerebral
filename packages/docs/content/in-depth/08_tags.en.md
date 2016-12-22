---
title: Tags
---

## Tags
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
  function someAction ({state, input}) {
    // Verify that it is a Tag
    if (statePath instanceof Tag) {
      // We create an object defining getters. The getter
      // is the name of the tag it correlates to and either
      // a function taking a path or an object for lookups
      const getters = {
        state: state.get,
        input
      }

      statePath.type // "state"
      statePath.getPath(getters) // "foo.bar"
      statePath.getValue(getters) // The value on path "foo.bar" in state tree
      statePath.getTags(getters) // All tags composed into this tag

    }
  }

  return someAction
}
```

So a tag has a **type** which can be used identify some logic you want to run. The value returned from **getPath** is the evaluated path on the tag. The value returned from **getValue** is any extracted value of the tag.

You can easily create your own action factories and use the tags. Here showing the implementation of a **set**

```js
import {Tag} from 'cerebral/tags'

function setFactory(target, value) {
  // We check if it is a tag and type is correct
  if (
    !(target instanceof Tag) ||
    !(target.type === 'state' || target.type === 'input')
  ) {
    throw new Error('You have to target state or input when setting')
  }

  function set({state, input}) {
    // We define the getters for populating the paths of a tag
    const getters = {state: state.get, input}


    // Since we allow both using a tag or a hardcoded value as value
    // we check if it is a tag. Then we either grab the value from the
    // tag or the value passed in
    const setValue = value instanceof Tag ? value.getValue(getters) : value

    state.set(target.getPath(getters), setValue)
  }

  return set
}
```

Custom operators often wants to extract paths, though not necessarily related to state or input. That is why we have the tag **string**.

```js
import {string} from 'cerebral/tags'
import showMessage from '../factories/showMessage'
import starsCount from '../computeds/starsCount'
[
  showMessage(string`There are ${starsCount} left`)
]
```
