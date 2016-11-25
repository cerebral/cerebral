---
title: Providers
---

## Providers

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

### Context Provider
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

### Creating a provider
You can use providers for pretty much anything, though tyically it is to handle some kind of side effect. Examples of providers is [cerebral-provider-firebase](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-firebase) and [cerebral-provider-http](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-http).

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
    context.myProvider = cachedProvider = cachedProvider || createProvider(context)

    return context
  }
}
```

This is a very typical setup for a provider. It creates and caches it.

### Supporting the debugger
You can make your context provider support the debugger by using the debugger that is exposed by the Cerebral devtools, when active.

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
    context.myProvider = cachedProvider = cachedProvider || createProvider(context)

    if (context.debugger) {
      context.myProvider = Object.keys(context.myProvider).reduce((wrappedProvider, key) => {
        const originFunc = cachedProvider[key]

        wrappedProvider[key] = (...args) => {
          context.debugger.send({
            method: key,
            args,
            color: '#333'
          })

          return originFunc.apply(cachedProvider, args)
        }

        return wrappedProvider
      }, {})
    }

    return context
  }
}
```

We are just wrapping the methods exported from the provider passing information to the debugger.
