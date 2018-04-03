# Compute

Normally you use state directly from the state tree, but sometimes you need to compute values. Typically filtering lists, grabbing the projects of a user, or other derived state. It is a good idea not to put this kind of logic inside your view layer, cause by creating a computed you can reuse the logic anywhere.

Cerebral allows you to compute state that can be used in multiple contexts. Let us look at the signature:

```js
import { Compute } from 'cerebral'

export default Compute(() => {
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
import { set } from 'cerebral/operators'
import { state } from 'cerebral/tags'

export const mySequence = [set(state`foo`, computedFoo)]
```

Or you can resolve it inside an action if you need to:

```js
import computedFoo from '../computedFoo'

export function myAction({ resolve }) {
  const foo = resolve.value(computedFoo)
}
```

You can even compose it into a Tag:

```js
import computedFoo from '../computedFoo'
import { state } from 'cerebral/tags'
import { set } from 'cerebral/operators'

export const mySequence = [set(state`${computedFoo}.bar`, 'baz')]
```

The compute signature is very flexible. It allows you to put in any number of arguments which will be evaluated. For example here we go and grab some state and props, before using their values to produce a new value.

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/tags'

export default Compute(state`foo`, props`bar`, (foo, bar) => {
  return foo + bar
})
```

We can even keep adding arguments and produce yet another value:

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/tags'

export default Compute(
  state`foo`,
  props`bar`,
  (foo, bar) => {
    return foo + bar
  },
  state`baz`,
  (computedFooBar, baz) => {
    return computedFooBar + baz
  }
)
```

That means you can compose computeds, lets try by splitting them up into two:

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/tags'

const fooBar = Compute(state`foo`, props`bar`, (foo, bar) => {
  return foo + bar
})

const fooBarBaz = Compute(state`baz`, (computedFooBar, baz) => {
  return computedFooBar + baz
})

export default Compute(fooBar, fooBarBaz)
```

There is one last thing to computeds and that is the **get** argument, which is always the last argument passed into the callback of a computed. This argument can be used to manually extract state and props, very useful to optimize computed lists.

For example we have items with an array of user ids. We create a computed taking in **itemKey** as a prop, extracts the item and then iterates the userIds to grab the actual users.

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/tags'

const computedItemUsers = Compute(
  state`items.${props`itemKey`}`,
  (item, get) => {
    return item.userIds.map((userId) => get(state`users.${userId}`))
  }
)

// In connect
connect({
  users: computedItemUsers
})
```

It uses the _itemKey_ property from the component to grab the actual item. It then grabs each user based on the userIds of the item. Then we could add additional computed to only get certain users.

```js
connect({
  item: Compute(filteredList, onlyAwesome)
})
```

Typically you can get away with most things using Tags, but compute will help you with any other scenarios where more "umph" is needed.
