# Factories
Function factories is a common term in programming. It is basically a function that returns a function:

```js
function createHelloMessage (name) {
  function helloMessage () {
    console.log(`Hello there ${name}`)
  }

  return helloMessage
}

const helloBob = createHelloMessage('Bob')
helloBob() // Logs: "Hello there Bob"
```

In Cerebral you will find yourself creating a lot of factories. Factories for creating actions and even factories for creating chains. Actually the Cerebral **operators** are action and chain factories.

## Action factory
```js
function hasUserRoleFactory (role) {
  function hasUserRole ({state, path}) {
    if (state.get('user.role') === role) {
      return path.true()
    }

    return path.false()
  }

  return hasUserRole
}
```

So this factory can now be used in any chain:

```js
import hasUserRole from '../factories/hasUserRole'

export default [
  hasUserRole('admin'), {
    true: [],
    false: []
  }
]
```

## Chain factory
```js
import {set, wait} from 'cerebral/operators'
import {state} from 'cerebral/tags'

function showMessageFactory (message, ms) {
  return [
    set(state`app.message`, message),
    wait(ms),
    set(state`app.message`, null)
  ]
}
```

Now this can be used in any chain:

```js
import showMessage from '../factories/showMessage'

export default [
  ...showMessage('Hello there!', 500)
]
```

Chain factories should always be **spread** into chains. Think of it as "merging it in". Usually it does not matter, cause it will just be treated as a parallel execution, but it is good practice.
