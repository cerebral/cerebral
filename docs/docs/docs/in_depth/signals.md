# Signals

The signals of Cerebral are named in past tense. So typically you would name a signal **inputChanged** or **mounted**. You call a signal just like you would call a function, the difference is that you start a function tree execution.

Cerebral uses the [function-tree](https://github.com/cerebral/function-tree) project to implement its signals. A function-tree allows you to define a tree of functions to be executed. In Cerebral world we call the arrays in a function-tree **chains**. These chains contains functions, we call them **actions**. So to sum up: *"signals are chains of actions"*.

```js
import actionA from '../actions/actionA'
import actionB from '../actions/actionB'

export default [
  actionA,
  actionB
]
```

To trigger a signal you can grab it from the controller:

```js
import {Controller} from 'controller'
import someChain from './chains/someChain'

const controller = Controller({
  signals: {
    somethingHappened: someChain
  }
})

const signal = controller.getSignal('somethingHappened')
signal()
```

This signal triggers synchronously and you can pass it a payload.

```js
...
signal({
  foo: 'bar'
})
```

This payload is brought into the signal execution and acts as the **input** of the signal. Typically you will not trigger signals manually this way, but rather from within a component.

```js
connect({
  foo: state`app.foo`,
  somethingHappened: signal`app.somethingHappened`
},
  function MyComponent (props) {
    return <button onClick={() => props.somethingHappened()}>Click me</button>
  }
)
```

The payload passed to a signal is typically the core value types of JavaScript. Object, Array, String, Number or Boolean. It is also possible to pass in some special value types, like files. For a full list of supported value types, check the [state API documentation](../api/02_state.html).
