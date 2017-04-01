# Providers

Providers are added to the context of every action executed by a signal. Providers can be everything from a tool you are already using, to something Cerebral specific. The point of providers is to separate side effects from execution. That means you can create all the logic you want with chains and actions without creating any dependencies to other tools. This makes them highly testable and generally gives you more flexibility.

Adding a provider is done by:

```js
import {Controller} from 'cerebral'

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

const controller = Controller({
  providers: [
    MyProvider
  ]
})
```

## Context Provider
There is a built in provider with Cerebral you can use to expose tools. The provider will wrap the tool so that you can see its usage in the debugger:

```js
import {Controller} from 'cerebral'
import {ContextProvider} from 'cerebral/providers'
import axios from 'axios'
import uuid from 'uuid'

const controller = Controller({
  providers: [
    ContextProvider({axios, uuid})
  ]
})
```

Note that some tools has a very complex API that **ContextProvider** has a hard time analyzing. With these kinds of tools it is a better idea to create your own provider, exposing APIs that you actually use from the original tool.

## Creating a provider
You can use providers for pretty much anything, though typically it is to handle some kind of side effect. Examples of providers is [cerebral-provider-firebase](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-firebase) and [cerebral-provider-http](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-http).

```js
function MyProvider (options = {}) {
  let cachedProvider = null

  function createProvider (context) {
    return {
      doSomething() {},
      doSomethingElse() {}
    }
  }

  return (context) => {
    context.myProvider = cachedProvider = (cachedProvider || createProvider(context))

    if (context.debugger) {
      context.debugger.wrapProvider('myProvider')
    }

    return context
  }
}
```

This is a very typical setup for a provider. It creates and caches it. It also wraps and methods exposed if the debugger is available, tracking its execution.
