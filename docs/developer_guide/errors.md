# Errors

Handling complex asynchronous flows is a challenging task for error handling. If things are not done correctly errors can be swallowed and you will have a hard time figuring out why your application does not work.

Error handling in Cerebral signals are done for you. Wherever you throw an error, it will be caught correctly and thrown to the console unless you have explicitly said you want to handle it. No matter if errors are thrown to console or not the debugger will always show the errors. The action in question is highlighted red, you will se the error message, the code related and even what executed related to you catching the error.

IMAGE

## Catching errors
To catch an error from a signal you define it with the signal definition:

*someModule.js*
```js
export default {
  state: {},
  signals: {
    // Define the signal as an object
    somethingHappened: {
      signal: [],
      catch: []
    }
  }
}
```

You catch errors using a new sequence of actions. If the signal has an error this catch sequence will trigger, passing in the error on the payload:

```js
{
  foo: 'bar', // already on payload
  error: {
    name: 'Error',
    message: 'undefined is not a function',
    stack: '...'
  }
}
```

You can also match on the name of the action:

*someModule.js*
```js
export default {
  state: {},
  signals: {
    // Define the signal as an object
    somethingHappened: {
      signal: [],
      catch: {
        FirebaseProviderError: []
      }
    }
  }
}
```

In this scenario we are only catching errors related to the Firebase provider, all other errors are thrown to console.

For optimal control you can use a function to define your catch:

*someModule.js*
```js
export default {
  state: {},
  signals: {
    // Define the signal as an object
    somethingHappened: {
      signal: [],
      catch(error) {
        if (error instanceof Error) {
          return []
        }
      }
    }
  }
}
```

With a function you get the error instance and matches expect to return an action sequence to trigger.

## Catching globally
In most applications error handling can be handled et a global level. That means you define your signals as normal and you rather define catch handlers on the controller itself:

```js
import {Controller} from 'cerebral'

const controller = Controller({
  modules: {},
  catch: {
    FirebaseProviderError: [],
    HttpProviderError: []
  }
})
```

## Provider errors
Any providers that can throw errors, typically related to server communication, has their own error type. That means when you use the **cerebral-provider-firebase** or **cerebral-provider-http** you will be able to catch errors specifically from these providers. Read more about those in the packages themselves.
