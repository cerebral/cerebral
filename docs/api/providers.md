# Providers

Providers are functions that runs before any action in any signal. Their purpose is to define and sometimes manipulate the context passed into every action. The providers run before every action, meaning that each action has a unique context object.

To add something to the context you create a provider:

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

There are a few things already available on the context when your provider runs:

```js
function MyProvider(context) {
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
