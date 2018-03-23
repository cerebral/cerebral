# Errors

```marksy
<Youtube url="https://www.youtube.com/embed/UdVjsKQLybw" />
```

Handling complex asynchronous flows is a challenging task for error handling. If things are not done correctly errors can be swallowed and you will have a hard time figuring out why your application does not work.

Error handling in Cerebral signals are done for you. Wherever you throw an error, it will be caught correctly and thrown to the console unless you have explicitly said you want to handle it. And even when you do explicitly handle it Cerebral will still show the error in the debugger as a **caught** error, meaning you can never go wrong. The action in question is highlighted red, you will see the error message, the code related and even what executed related to you catching the error.

![debugger error](/images/debugger_error.png)

## Catching errors

You catch errors in module:

```js
import { Module } from 'cerebral'
import { FirebaseProviderError } from '@cerebral/firebase'
import * as sequences from './sequences'

export default Module({
  state: {},
  signals: {
    somethingHappened: sequences.doSomething
  },
  catch: [[FirebaseProviderError, sequences.catchFirebaseError]]
})
```

We basically tell the module that we are interested in any errors thrown by the Firebase Provider. Then we point to the sequence of actions we want to handle it. An error will be passed in to the sequence of actions handling the error:

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

## Creating an error type

Cerebral ships with a base error class of **CerebralError**. It extends **Error** and adds some functionality to give more details about the error and show it correctly in the debugger. You can extend this error class to create your own error types.

```js
import { CerebralError } from 'cerebral'

export class AppError extends CerebralError {}
```

You can extend the error with your own name and props.

```js
import { CerebralError } from 'cerebral'

export class AuthError extends CerebralError {
  constructor(message, code) {
    super(message)

    this.name = 'AuthError'
    this.code = code
  }
}
```

```marksy
<CodeSandbox url="https://codesandbox.io/embed/61902m93w3?view=editor" />
```
