# Operators
Creating an action for any kind of state change will be tedious. That is why Cerebral has **operators**. These operators are just functions that return an action for you. There is an operator for every kind of state change, but also other operators controlling time and execution paths. Also other packages in the Cerebral ecosystem has their own operators.

## State changes
The most common operators you will use changes the state of your application.

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo`, 'bar')
]
```

With the help of **tags** we are able to express that we want to set the state path **foo** to have the value **"bar"**. We can also use the **props** tag to express that we want to grab the value from the current payload of the signal instead:

```js
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default [
  set(state`foo`, props`foo`)
]
```

And this is how you go about using operators:

```js
import {merge, push, pop} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default [
  merge(state`some.object`, props`newObj`),
  push(state`some.list`, props`newItem`),
  pop(state`some.otherList`)
]
```

## Time
You can control time using operators. For example to hold a signals execution, you can:

```js
import {wait} from 'cerebral/operators'
import doThis from '../actions/doThis'
import doThat from '../actions/doThat'

export default [
  doThis,
  wait(2000),
  doThat
]
```

You can also do more complex time control using **debounce**.

```js
import {set, debounce} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import makeQueryRequest from '../chains/makeQueryRequest'

export default [
  set(state`query`, props`query`),
  debounce(500), {
    continue: makeQueryRequest,
    discard: []
  }
]
```

## Paths
Some operators helps you go down specific paths of execution.

```js
import {when, equals} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default [
  when(state`app.isAwesome`), {
    true: [],
    false: []
  },
  equals(state`user.role`), {
    admin: [],
    user: [],
    otherwise: []
  }
]
```

As you can see **operators** are a powerful concept that allows you to describe how your application executes and changes its state. Other tools in the Cerebral ecosystem also has its own operators for running side effects like HTTP requests, Firebase requests etc. Most of your application can actually be described with operators.

## Tutorial

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/bins/-KdBHyLJDefteJy0s821)

Let us first change out our **updateSubtitle** action with an operator instead. Since we did a *set*, we change it out with the **set** operator. Operators also take advantage of the tags. In this case, the first argument uses a tag to target our state. The second argument could also have been a tag, but we hardcode a value instead.

Now lets add a **wait** operator and another **set** to close our toast message after a few seconds. So go ahead and change our **buttonClicked** signal in *App.js* to execute 2 more actions:

```js
...
import {set, wait} from 'cerebral/operators'
import {state} from 'cerebral/tags'
...
{
  buttonClicked: [
    set(state`toast`, 'Button Clicked!'),
    wait(4000),
    set(state`toast`, null)
  ]
}
```

Now when we check again in the debugger you will see all the 3 actions executed when signal *buttonClicked* got triggered.

Still speaking of the debugger did you notice the **props: {}** in front of every action executed? Looks quite empty. Let us look at that in the next chapter! If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
