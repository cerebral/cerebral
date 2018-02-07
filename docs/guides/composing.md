# Composing

Composing, or composition, is a term we use in programming to explain the "lego blockyness" of our code. To give you an example think of a function:

```js
function myFunction () {}
```

Functions are composable. You can call the same function multiple times:

```js
function myFunction () {}

myFunction()
myFunction()
```

You can pass the function into an other function and call it from there:

```js
function myFunction () {}
function someOtherFunction (func) {
  func()
}

someOtherFunction(myFunction)
```

And you can even call a function which returns a function:

```js
function createFunction () {
  return function myCreatedFunction () {}
}

const func = createFunction()
func()
```

Functions are awesome, but there is actually a hidden requirement here. For these functions to keep their composability they need to be pure. If the function would do:

```js
let someState = 0
function myFunction() {
  someState++
  doThis()
  doThat()
}
```

It would loose its composability because it would run differently every time and you would be forced to run **doThis** and **doThat**.

## Cerebral actions

When running a signal in Cerebral you run a sequence of actions. For example:

```js
[
  doThis,
  doThat
]
```

Even though actions in Cerebral are not 100% pure, they do inherit all the benefits of composition as explained above. We kinda force you to write your code in a composable manner. So let us explore a bit more the benefits this gives you.

```marksy
<Twitter text="Even though actions in Cerebral are not 100% pure, they do inherit all the benefits of composition as explained above." hashtags="cerebral"/>
```

## Scoping for composition
When we want to make code reusable we need to scope it to a single task. That way we can build more complex tasks by composing together smaller ones. This is easy and intuitive in Cerebral:

```js
function getUser({http}) {
  return http.get('/user')
}

export default getUser
```

This action can now be used in any sequence.

```js
import getUser from './actions/getUser'

export default [
  getUser
]
```

In Cerebral you are encouraged to put your actions in individual files or group actions related to each in one file and export them individually.

So every action should just do one single thing.

## Sequences

So let us imagine that we build a sequence like this:

*updateUser.js*
```js
import getUser from './actions/getUser'
import setUser from './actions/setUser'

export default [
  getUser,
  setUser
]
```

We can just as easily compose this sequence into an existing sequence:

```js
import doThis from './actions/doThis'
import updateUser from './updateUser'

export default [
  updateUser,
  doThis
]
```

For Cerebral it does not matter if you insert a single action or a sequence of actions, they compose just fine.

## Action factories
An other powerful concept in the introduction is the concept of a factory, a function that creates a function. This allows us to create more generic action factories in Cerebral. For example:

```js
function httpGetFactory (url) {
  function httpGet ({http}) {
    return http.get(url)
  }
  
  return httpGet
}

export default httpGetFactory
```

Now instead of having a **getUser** action, we can use **httpGet** for any kind of get request we want to run:

```js
import httpGet from './factories/httpGet'
import setUser from './actions/setUser'

export default [
  httpGet('/user'),
  setUser
]
```

Actually most packages and also Cerebral itself takes advantage of this concept and call them operators:

```js
import {httpGet} from '@cerebral/http/operators'
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default [
  httpGet('/user'),
  set(state`user`, props`result`)
]
```

That means you can write a lot of your business logic without creating a single action.

## Sequence factories
But since sequences and actions can be composed together you can also create factories for sequences. A typical example of that is to dynamically run sequences. For example:

```js
import {httpGet} from '@cerebral/http/operators'
import {set, when} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

function authenticate(continueSequence) {
  return [
    when(state`user`) {
      'true': continueSequence,
      'false': [
        httpGet('/user'),
        set(state`user`, props`result`),
        continueSequence
      ]
    }
  ]
}

export default authenticate
```

And in some other sequence:

```js
import doThis from './actions/doThis'
import authenticate from './factories/authenticate'

export default authenticate([
  doThis
])
```

## Composing signals

You might get into a situation where it seems natural to think that you want to compose by firing off a signal from an other signal. For example:

```js
[
  doThis,
  doThat,
  function nextSignal ({controller}) {
    controller.getSignal('some.signal')()
  }
]
```

This is not a good idea because this will run two separate processes. If you rather compose their sequences together:

```js
import someSignal from './someSignal'

[
  doThis,
  doThat,
  someSignal
]
```

You will get the same execution, only it is composed together. This is also now reflected as one execution in the debugger. If this needs to be dynamic in nature you can use factories.

## Summary

The anatomy of a Cerebral action gives you the power of composability while running side effects. That means you are not forced writing completely pure input/output functions, but run side effects as you please.