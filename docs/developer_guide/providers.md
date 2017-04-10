# Providers

Providers are added to the context of every action executed by a signal. Providers can be everything from a tool you are already using, to something Cerebral specific. The point of providers is to separate side effects from execution. That means you can create all the logic you want with chains and actions without creating any dependencies to other tools. This makes them highly testable and generally gives you more flexibility.

## Just add a tool
If you are using libraries where you want access to everything they provide you can simply add them as a provider using an object:

```js
import {Controller} from 'cerebral'
import {ContextProvider} from 'cerebral/providers'
import axios from 'axios'
import uuid from 'uuid'

const controller = Controller({
  providers: [{axios, uuid}]
})
```

Note that some tools has a very complex API that is difficult for Cerebral to analyze. With these kinds of tools it is a better idea to create your own provider, exposing APIs that you actually use from the original tool.

## Creating a provider
You can use providers for pretty much anything, though typically it is to handle some kind of side effect. Examples of providers is [cerebral-provider-storage](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-storage), [cerebral-provider-firebase](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-firebase) and [cerebral-provider-http](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-http).

To use a provider with Cerebral you put it in the providers array:

```js
const controller = Controller({
  providers: [
    StorageProvider(),
    HttpProvider(),
    FirebaseProvider(),

    // Let us create this
    GreetProvider({
      numberOfExclamationMarks: 3
    })
  ]
})
```

The convention on creating a provider looks like this:

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
  function GreetProvider (context) => {
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

Now this provider is available to any action:

```js
function myAction ({greet}) {
  greet.hello('Thor') // "Hello Thor!!!"
}
```

As mentioned above we use providers to separate side effects from execution, allowing us to provider our own custom API to our application.
