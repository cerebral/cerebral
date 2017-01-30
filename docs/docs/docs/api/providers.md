# Providers

Providers are functions that runs before any action in any signal. Their purpose is to define and sometimes manipulate the context passed into every action. The providers run before every action, meaning that each action has a unique context object.

## Context provider
The context provider allows you to attach any third party library to the context of all actions. Typically:


```js
import {Controller} from 'cerebral'
import {ContextProvider} from 'cerebral/providers'
import axios from 'axios'

const controller = Controller({
  providers: [
    ContextProvider({
      axios
    })
  ]
})
```

Now axios will be available on the context of any action. The context provider also wraps any methods and sends information to the debugger about their use.

Look at the **community tools** for other providers that can be used, or create your own.

## Creating a provider

An example of a provider is the built in **InputProvider** of function-tree.

It looks something like this:

```js
function InputProvider(context, functionDetails, payload) {
  context.input = payload

  return context
}
```

The providers are called by **function-tree** with some arguments.

- **context** is the current context object that will be passed into the function (action)
- **functionDetails** gives information about the function (action) that will run
- **payload** the current payload of the execution (signal)

You can create a standalone provider simply by defining a function like the **InputProvider** in the first example. But you can also define a provider on a module. This allows you to combine providers and signals.

```js
export default (module) => {
  const MODULE_PATH = module.path.join('.')

  return {
    state: {
      foo: true
    },
    signals: {
      somethingHappened: [
        toggle(state`${MODULE_PATH}.foo`)
      ]
    },
    provider(context) {
      context.myProvider = {
        doSomeSideEffect() {
          someSideEffect().then(() => {
            module.controller.getSignal(`${MODULE_PATH}.somethingHappened`)()
          })
        }
      }

      return context
    }
  }
}
```

Now any action can:

```js
function someAction({myProvider}) {
  myProvider.doSomeSideEffect()
}
```

You should think twice when considering a provider though. Always favor signal composition and actions as those will always end up more readable and better visualized in the debugger. Providers are typically used for general enhancements, not application specific.

## Already on the context
There are some things already available on the context.

```js
function MyProvider(context) {
  context.execution // Information on the function tree execution
  context.controller // The Cerebral controller
  context.debugger // If devtools is added, you can send messages to the debugger
  context.input // Current payload
  context.path // If any paths are defined after the action to be executed

  return context
}
```
