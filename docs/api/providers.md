# Providers

Providers are functions that runs before any action in any signal. Their purpose is to define and sometimes manipulate the context passed into every action. The providers run before every action, meaning that each action has a unique context object.

Providers are created with a function:

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

## Example provider

```js
// We create a factory, allowing you to pass in options to it
function GreetProviderFactory (options = {}) {
  // We use a variable to cache the created provider
  let cachedProvider = null

  // Just some custom code to handle an option
  let exclamationMarks = ''

  for (let x = 0; x < options.numberOfExclamationMarks || 0; x++) {
    exclamationMarks += '!'
  }

  // This is the function that creates the provider,
  // typically just an object with some methods
  function createProvider (context) {
    return {
      hello (name) {
        return `Hello, ${name}${exclamationMarks}`
      }
    }
  }

  // The function that is run by Cerebral, providing the context
  // for you to attach your provider to
  function GreetProvider (context) {
    context.greet = cachedProvider = (cachedProvider || createProvider(context))

    // You can wrap the provider with the debugger
    // to show information about its usage in the debugger
    if (context.debugger) {
      context.debugger.wrapProvider('greet')
    }

    // Always return the context after mutating it
    return context
  }

  return GreetProvider
}

export default GreetProviderFactory
```
