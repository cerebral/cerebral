# Compute
Normally you use state directly from the state tree, but sometimes you need to compute values. Typically filtering lists, grabbing the projects of a user or other derived state.

Cerebral allows you to compute state that can be used in multiple contexts. Let us look at the signature:

```js
import {compute} from 'cerebral'

export default compute(() => {
  return 'foo'
})
```

You can now use this with **connect**:

```js
import computedFoo from '../computedFoo'

connect({
  foo: computedFoo
})
```

You can use it with operators in a signal:

```js
import computedFoo from '../computedFoo'
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo`, computedFoo)
]
```

Or you can resolve it inside an action if you need to:

```js
import computedFoo from '../computedFoo'

function myAction ({resolve}) {
  const foo = resolve.value(computedFoo)
}
```

You can even compose it into a Tag:

```js
import computedFoo from '../computedFoo'
import {state} from 'cerebral/tags'

state`${computedFoo}.bar`
```

## Getting data
Compute can grab data related to where it is run. For example in **connect** you have access to both state and properties of the component. In a signal you would have access to state and the input to the signal.

```js
import {compute} from 'cerebral'

export default compute((get) => {
  return get.state('foo') + get.props('bar')
})
```

Cerebral now knows what paths this computed is interested in and can optimize its need to run again to produce a changed value.

## Composing
What makes compute very powerful is its ability to compose tags and other compute.

```js
import {compute} from 'cerebral'
import {props} from 'cerebral/tags'

const computedItem = compute(
  props`itemKey`,
  (itemKey, get) => {
    return get.state(`items.${itemKey}`)
  }
)

// In connect
connect({
  item: computedItem
})
```

It uses the *itemKey* property from the component to grab the actual item. You can also compose multiple compute together.

```js
connect({
  item: compute(filteredList, onlyAwesome)
})
```

Here *filteredList* returns a list of filtered items, where *onlyAwesome* expects to receive a list and filters it again.

```js
compute((list) => {
  return list.filter((item) => item.isAwesome)
})
```

It is possible to combine tags and functions as many times as you would like:

```js
compute(
  state`currentItemKey`,
  (currentItemKey, get) => {
    return get.state(`item.${currentItemKey}`)
  },
  state`isAwesome`,
  (item, isAwesome) => {
    return item.isAwesome === isAwesome
  }
)
```

Typically you get away with most things using Tags, but compute will help you with any other scenario where more "umph" is needed.
