# Errors

Handling complex asynchronous flows is a challenging task for error handling. If things are not done correctly errors can be swallowed and you will have a hard time figuring out why your application does not work.

Error handling in Cerebral signals are done for you. Wherever you throw an error, it will be caught correctly and thrown to the console unless you have explicitly said you want to handle it. And even when you do explicitly handle it Cerebral will still show the error in the debugger as a **caught** error, meaning you can never go wrong. The action in question is highlighted red, you will see the error message, the code related and even what executed related to you catching the error.

![debugger error](/images/debugger_error.png)

## Catching errors
To catch an error from a signal you can define it with the signal definition:

*someModule.js*
```js
export default {
  state: {},
  signals: {
    // Define the signal as an object
    somethingHappened: {
      signal: someSequence,
      catch: new Map([
        [FirebaseProviderError, someErrorHandlingSequence]
      ])
    }
  }
}
```

If you are not familiar with the **Map** JavaScript API, [you can read more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). We basically tell the signal that we are interested in any errors thrown by the Firebase Provider. Then we point to the sequence of actions we want to handle it. An error will be passed in to the sequence of actions handling the error:

```js
{
  foo: 'bar', // already on payload
  error: {
    name: 'FirebaseProviderError',
    message: 'Could not connect',
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
} from '@cerebral/firebase'
import {
  HttpProviderError
} from '@cerebral/http'

const controller = Controller({
  modules: {},
  catch: new Map([
    [FirebaseProviderAuthenticationError, someErrorSequence]
    [FirebaseProviderError, someErrorSequence],
    [HttpProviderError, someErrorSequence]
  ])
})
```

## Creating an error type
JavaScript has a base error class of **Error**. When you create your own error types it makes sense to extend **Error**. This is only recently supported in browsers, but you can use [es6-error](https://www.npmjs.com/package/es6-error) to make sure extending errors works correctly.

```js
import ES6Error from 'es6-error'

class AppError extends ES6Error {
  constructor(message) {
    super(message)
    this.name = 'AppError'
  }
}
```

This allows you to create more specific errors by subclassing:

```js
class AuthError extends AppError {
  constructor(message, code) {
    super(message)

    this.name = 'AuthError'
    this.code = code
  }
  // By adding a custom "toJSON" method you decide
  // how the error will be shown when passed to the
  // debugger and your catch handler
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack
    }
  }
}
```

To play around with modules [have a look at this BIN](https://www.webpackbin.com/bins/-Kp_358GlWxIbpMRTWm1).
