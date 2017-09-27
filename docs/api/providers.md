# Providers

Providers are functions that runs before any action in any signal. Their purpose is to define and sometimes manipulate the context passed into every action. The providers run before every action, meaning that each action has a unique context object.

There are three levels of abstraction to create a provider. Choose the one that makes sense to you.

## 1. Object with methods
This is the simplest version of a provider where you do not need access to anything else in Cerebral. This provider is automatically wrapped by the debugger, where available.

```js
export default {
  greet() {
    return 'hello'
  }
}
```

```js
import {Controller, provide} from 'cerebral'
import greeter from './providers/greeter'

export default Controller({
  providers: [
    provide('greeter', greeter)
  ]
})
```

## 2. Function
When using a function you get access to the context. That means you can grab static stuff from the context, typically trigger a signal. This provider is automatically wrapped by the debugger, where available.

```js
export default (context) => {
  return {
    triggerSignalOnEvent(signalPath, event) {
      window.addEventListener(event, () => {
        context.controller.getSignal(signalPath)()
      })
    }
  }
}
```

```js
import {Controller, provide} from 'cerebral'
import trigger from './providers/trigger'

export default Controller({
  providers: [
    provide('trigger', trigger)
  ]
})
```

## 3. Low level

```js
function MyProvider (context, functionDetails, payload, prevPayload) {
  // The current context object, which can be mutated
  context

  // The details of the action running, like name, index (id) etc.
  functionDetails

  // The current payload passed to the action
  payload

  // The previous payload
  prevPayload

  // You have to return the context after it has bee mutated
  return context
}
```

This function needs to be listed in the **providers** property of the controller to be registered:

```js
Controller({
  providers: [MyProvider]
})
```

Ability to add a single provider is also available in modules:

```js
{
  state: {},
  signals: {},
  provider: MyProvider
}
```

There are a few things already available on the context when your provider runs:

```js
function MyProvider (context) {
  context.execution // Information on the function tree execution
  context.controller // The Cerebral controller
  context.debugger // If devtools is added, you can send messages to the debugger
  context.props // Current payload
  context.path // If any paths are defined after the action to be executed
  context.state // The state API
  context.resolve // Resolve values and tag paths

  return context
}
```
