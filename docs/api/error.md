# Error

The **CerebralError** allows you to create your own error types to be used to catch errors in your signals.

```js
import { CerebralError } from 'cerebral'

export class MyError extends CerebralError {}
```

The error is thrown like this:

```js
import { MyError } from './errors'

function someAction () {
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
  signals: {
    somethingHappened: sequences.doThis
  },
  catch: [
    [MyError, sequences.handleError]
  ]
})
```
