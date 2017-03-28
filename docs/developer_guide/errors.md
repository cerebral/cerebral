# Errors

Handling complex asynchronous flows is a challenging task for error handling. If things are not done correctly errors can be swallowed and you will have a hard time figuring out why your application does not work.

Error handling in Cerebral signals are done for you. Wherever you throw an error, it will be caught correctly and thrown to the console unless you have explicitly said you want to handle it. No matter if errors are thrown to console or not, the debugger will always show the errors. The action in question is highlighted red, you will see the error message, the code related and even what executed related to you catching the error.

![debugger_error](/images/debugger_error.png)

## Catching errors
To catch an error from a signal you define it with the signal definition:

*someModule.js*
```js
export default {
  state: {},
  signals: {
    // Define the signal as an object
    somethingHappened: {
      signal: someSequence,
      catch: new Map([
        [Error, someSequenceHandlingError]
      ])
    }
  }
}
```

If you are not familiar with the **Map** JavaScript API, [you can read more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). We basically tell the signal that we are interested in any instance of error thrown... meaning all errors basically. Then we point to the sequence of actions we want to handle it. An error will be passed in to the sequence of actions handling the error:

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

## Catching globally
In most applications error handling can be handled at a global level. That means you define your signals as normal and you rather define catch handlers on the controller itself:

```js
import {Controller} from 'cerebral'
import {
  FirebaseProviderAuthenticationError,
  FirebaseProviderError
} from 'cerebral-provider-firebase'
import {
  HttpProviderError
} from 'cerebral-provider-http'

const controller = Controller({
  modules: {},
  catch: new Map([
    [FirebaseProviderAuthenticationError, []]
    [FirebaseProviderError, []],
    [HttpProviderError, []]
  ])
})
```

## Provider errors
Any providers that can throw errors, typically related to server communication, has their own error type. That means when you use the **cerebral-provider-firebase** or **cerebral-provider-http** you will be able to catch errors specifically from these providers. Read more about those in the packages themselves.
