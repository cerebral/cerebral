# Error

The **CerebralError** allows you to create your own error types to be used to catch errors in your sequences. The **catch** handler defined on the module will propagate up to parent modules. That means if a nested module does not catch an error, one of the parent modules can catch it if configured to do so.

```js
import { CerebralError } from 'cerebral'

export class MyError extends CerebralError {}
```

The error is thrown like this:

```js
import { MyError } from './errors'

function someAction() {
  throw new MyError('Some message', {
    // any details
  })
}
```

And caught like this:

```js
import { Module } from 'cerebral'
import { MyError } from './errors'
import * as sequences from './sequences'

export default Module({
  sequences,
  catch: [
    [MyError, sequences.handleError]
  ]
})
```
