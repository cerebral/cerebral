---
title: Chains and paths
---

## Chains and paths

When you trigger a signal it will run a chain of actions. We express this chain as an array and reference whatever actions we want to run:

```js
import actionA from '../actions/actionA'
import actionB from '../actions/actionB'

export default [
  actionA,
  actionB
]
```

Cerebral runs one action after the other synchronously. When an action returns a promise it will hold until the promise resolves and then continue.

### Parallel execution
You can also run these actions in parallel. You do that by grouping them in another array:

```js
import actionA from '../actions/actionA'
import actionB from '../actions/actionB'
import actionC from '../actions/actionC'

export default [
  [
    actionA,
    actionB
  ],
  actionC
]
```

If actionA returns a promise actionB will still be run instantly, meaning that they run in parallel. When both actionA and actionB is done, actionC is run.

### Composing
Chains can be composed into an other chain by using the spread operator. This is a powerful concept that allows you to compose large pieces of logic into other parts of your application.

```js
import actionA from '../actions/actionA'
import actionB from '../actions/actionB'
import chainA from '../chains/chainA'

export default [
  actionA,
  ...chainA,
  actionB
]
```

Cerebral will now run this as one signal, first running *actionA*, then whatever is expressed in *chainA* and then run *actionB* last.

### Paths
Chain can also express execution paths. For example:

```js
import actionA from '../actions/actionA'
import actionB from '../actions/actionB'
import actionC from '../actions/actionC'

export default [
  actionA, {
    foo: [
      actionB
    ],
    bar: [
      actionC
    ]
  }
]
```

You can think of this as "if statements" in the chain. When a path is expressed after an action, the context of that action will have a **path** on its context. For example in this example:

```js
function actionA ({path}) {
  path.foo // function
  path.bar // function
}
```

When the action returns one of these paths, that path will be executed:

```js
function actionA ({path}) {
  return path.foo()
}
```

This is possible due to Cerebrals static analysis of the signals. It knows exactly how it is going to run before it is executed.

You can also pass a payload to the path:

```js
function actionA ({path}) {
  return path.foo({
    foo: 'bar'
  })
}
```

This is merged into the *input* and made available to the next actions. If you return a promise from an action you just resolve the path:

```js
function actionA ({path}) {
  return new Promise((resolve) => {
    resolve(path.foo({
      foo: 'bar'
    }))
  })
}
```
