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

## Name
You can name a sequence, which will be displayed in debugger:
```js
import {sequence} from 'cerebral'
import someAction from '../actions/someAction'

export default sequence('my sequence', [
  someAction
])
```

## Compose
You can compose a sequence into existing sequence. The debugger will show this composition:
```js
import someAction from '../actions/someAction'
import someOtherSequence from './someOtherSequence'

export default [
  someAction,
  someOtherSequence
]
```

## Abort
You can abort a sequence execution:

```js
import {sequence} from 'cerebral'

function someActionAborting ({abort}) {
  return abort({}) // Optional payload
}
function someAction () {}
function someActionHandlingAbort () {}

export default sequence('my sequence', [
  someActionAborting,
  someAction // will not run
], [
  someActionHandlingAbort
])
```

Abort does not **bubble**, meaning actions that abort will only reach its specific abort sequence.
