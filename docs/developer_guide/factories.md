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

In Cerebral you will find yourself creating a lot of factories. Factories for creating actions and even factories for creating sequences of actions. Actually the Cerebral **operators** are action and actions sequence factories.

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

So this factory can now be used in any sequence:

```js
import hasUserRole from '../factories/hasUserRole'

export default [
  hasUserRole('admin'), {
    true: [],
    false: []
  }
]
```

## Actions sequence factory
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

Now this can be used in any other sequence of actions:

```js
import showMessage from '../factories/showMessage'

function someAction () {}

export default [
  someAction,
  showMessage('Hello there!', 500)
]
```

## Tutorial

**Before you start,** [load this BIN on Webpackbin](https://www.webpackbin.com/bins/-KdBPZwKFDQKkAcUqRte)

To see how **factories** are defined you may also check out the already existing code inside cerebral itself.
E.g. that is how the **wait** operator looks like:

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

You can see that a **factory** is just a function that returns another function which we call **action**. The action itself (wait) returns a promise. This promise is what tells the signal to hold its execution until it is resolved. Because **wait** is quite a common operation it's already included as an operator in the default

Let us create our own custom **showToast** factory. It will return a sequence of actions. As you can see we have moved the operators we defined previously into this array, using the arguments passed into the factory. As an example we want to name this sequence of actions, so instead of using an array we rather use the **sequence** function. They are exactly the same, only the function allows us to pass in a name as the first argument:

```js
import {Controller, sequence} from 'cerebral'
...
function showToast(message, ms) {
  return sequence('showToast', [
    set(state`toast`, message),
    wait(ms),
    set(state`toast`, null)
  ])
}
...
const controller = Controller(...)
```

We need to adjust the signal as well:
```js
Controller({
  signals: {
    buttonClicked: [
      showToast(props`message`, 1000)
    ]
  }
})
```

When this now triggers you will see in the debugger the **showToast** sequence composed into our signal definition and it is even named. This is a good practice for very complex flows, but not strictly necessary. Using plain arrays will get you very far.

Congratulations! You have successfully mastered the power of factories. But there are a couple of more concepts that will help you define state changes, jump over to the next chapter to find out more.

If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
