# Sequence
A sequence runs actions one after the other. If an action returns a promise it will hold until the promise is resolved or rejected.

Simple format of a sequence is to use an array literal:
```js
import someAction from '../actions/someAction'

export default [
  someAction
]
```

You can explicitly create a sequence:
```js
import {sequence} from 'cerebral'
import someAction from '../actions/someAction'

export default sequence([
  someAction
])
```

You can name a sequence, which will be displayed in debugger:
```js
import {sequence} from 'cerebral'
import someAction from '../actions/someAction'

export default sequence('my sequence', [
  someAction
])
```

You can compose a sequence into existing sequence. The debugger will show this composition:
```js
import someAction from '../actions/someAction'
import someOtherSequence from './someOtherSequence'

export default [
  someAction,
  someOtherSequence
]
```
