# Compute
Computes calculate and cache derived state values. Using computes helps to keep logic out of the application view components, can improve performance and make applications easier to test.

```js
import { Compute } from 'cerebral' // upperCase since version 4.0
import { state } from 'cerebral/tags'

export default Compute(
  state`user.name`,
  (name) => {
    return `Hi ${name}`
  }
)
```

A compute takes any number and type of arguments, where each argument is passed to the next function argument (**compute function**). Tag and compute arguments will be resolved to a value when the compute executes, all other arguments are forwarded. The **compute functions** are called whenever the compute is executed, all preceding values (resolved or forwarded) will be passed with an additional **get** argument.

```js
import { Compute } from 'cerebral'
import { state } from 'cerebral/tags'
import someOtherComputed from './someOtherComputed'

export default Compute(
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
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/tags'

export default Compute(
  state`user.id`,
  (userId, get) => {
    return get(state`projects.${userId}`).length > get(props`limit`)
  }  
)
```
