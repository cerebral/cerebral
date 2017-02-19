# Compute

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`user.name`,
  (name) => {
    return `Hi ${name}`
  }  
)
```

A compute takes any number and type of arguments, where each argument is passed to the next function argument.

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import someOtherComputed from './someOtherComputed'

export default compute(
  state`user.name`,
  'foo',
  (name, foo) => {
    return `Hi ${name}`
  },
  someOtherComputed,
  (computedHello, someOtherComputedValue) => {
    return `${computedHello} - ${someOtherComputedValue}`
  }
)
```

That last argument of each function is **get**, it allows you to manually extract state and props.

```js
import {compute} from 'cerebral'
import {state, props} from 'cerebral/tags'

export default compute(
  state`user.id`,
  (userId, get) => {
    return get(state`projects.${user.id}`).length > get(props`limit`)
  }  
)
```
