# Parallel
A parallel runs actions all actions right after each other, even if they return a promise.

```js
import {parallel} from 'cerebral'
import someAsyncAction from '../actions/someAsyncAction'
import someOtherAsyncAction from '../actions/someOtherAsyncAction'

export default parallel([
  someAsyncAction,
  someOtherAsyncAction
])
```

You can name a parallel, which will be displayed in debugger:
```js
import {parallel} from 'cerebral'
import someAsyncAction from '../actions/someAsyncAction'
import someOtherAsyncAction from '../actions/someOtherAsyncAction'

export default parallel('my parallel', [
  someAsyncAction,
  someOtherAsyncAction
])
```

You can compose parallel into any existing sequence:
```js
import {parallel} from 'cerebral'
import someAction from '../actions/someAction'
import someAsyncAction from '../actions/someAsyncAction'
import someOtherAsyncAction from '../actions/someOtherAsyncAction'

export default [
  someAction,
  parallel('my parallel', [
    someAsyncAction,
    someOtherAsyncAction
  ])
]
```
