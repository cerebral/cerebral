# Compute

Normally you use state directly from the state tree, but sometimes you need to compute state. Typically filtering lists, grabbing the projects of a user, or other derived state. It is a good idea not to put this kind of logic inside your view layer, cause by creating a computed you can reuse the logic anywhere and it will automatically optimize the need to recalculate the value.

Cerebral allows you to compute state that can be used in multiple contexts. Let us look at an example:

```js
import { Compute } from 'cerebral'
import { state } from 'cerebral/proxy'

export const filteredList = Compute({
  items: state.items,
  filter: state.filter
})(function filterList({ items, filter }) {
  return items.filter((item) => item[filter.property] === filter.value)
})
```

When we call a computed we give it the dependencies to produce our calculated value. This returns a function which you can call giving a callback that receives the dependencies.

```marksy
<Info>
You might ask why we have this signature. The reason is that Cerebral can be written with types and the only way to infer the correct type is by splitting the dependencies and the actualy computation in two different executions.
</Info>
```

A computed needs to be attached to a module. This is simply done by:

```js
import { Module } from 'cerebral'
import * as computed from './computed'

export default Module({
  computed
})
```

You can now reference this computed everywhere. When connecting to components using **connect**:

```js
import { computed } from 'cerebral/proxy'

connect({
  foo: computed.filteredList
})
```

You can use it with operators in a signal:

```js
import { set } from 'cerebral/operators'
import { state, computed } from 'cerebral/proxy'

export const mySequence = [set(state.filteredList, computed.filteredList)]
```

Or you can resolve it inside an action if you need to:

```js
import { computed } from 'cerebral/proxy'

export function myAction({ get }) {
  const filteredList = get(computed.filteredList)
}
```

You can even compose it into a proxy:

```js
import { state, computed } from 'cerebral/proxy'
import { set } from 'cerebral/operators'

export const mySequence = [set(state[computed.somPropKey].bar, 'baz')]
```

That means you can compose computeds, lets try by splitting them up into two:

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/proxy'

const fooBar = Compute(state.foo, props.bar, (foo, bar) => {
  return foo + bar
})

const fooBarBaz = Compute(state.baz, (computedFooBar, baz) => {
  return computedFooBar + baz
})

export default Compute(fooBar, fooBarBaz)
```

There is one last thing to computeds and that is the **get** argument, which is always the last argument passed into the callback of a computed. This argument can be used to manually extract state and props, very useful to optimize computed lists.

For example we have items with an array of user ids. We create a computed taking in **itemKey** as a prop, extracts the item and then iterates the userIds to grab the actual users.

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/proxy'

const computedItemUsers = Compute(state.items[props.itemKey], (item, get) => {
  return item.userIds.map((userId) => get(state.users[userId]))
})

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

Typically you can get away with most things using proxies, but compute will help you with any other scenarios where more "umph" is needed.
