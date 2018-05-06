# Compute

Normally you use state directly from the state tree, but sometimes you need to compute state. Typically filtering lists, grabbing the projects of a user, or other derived state. It is a good idea not to put this kind of logic inside your view layer, cause by creating a computed you can reuse the logic anywhere and it will automatically optimize the need to recalculate the value.

## Create a computed

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

A computed needs to be attached to a module. By convention you just attach all the computed you export from the _computed_ file related to a module:

```js
import { Module } from 'cerebral'
import * as computed from './computed'

export default Module({
  computed
})
```

## With components

Here shown with _React_:

```js
import { computed } from 'cerebral/proxy'

connect({
  list: computed.filteredList
})(function List({ list }) {
  return <ul>{list.map((item) => <li>{item.title}</li>)}</ul>
})
```

## With operators

```js
import { set } from 'cerebral/operators'
import { state, computed } from 'cerebral/proxy'

export const mySequence = [set(state.filteredList, computed.filteredList)]
```

## With actions

```js
import { computed } from 'cerebral/proxy'

export function myAction({ get }) {
  const filteredList = get(computed.filteredList)
}
```

## With proxy

```js
import { state, computed } from 'cerebral/proxy'
import { set } from 'cerebral/operators'

export const mySequence = [set(state[computed.somPropKey].bar, 'baz')]
```

## Computing computeds

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/proxy'

export const fooBar = Compute({
  foo: state.foo,
  bar: props.bar
})(({ foo, bar }) => {
  return foo + bar
})

export const fooBarBaz = Compute({
  fooBar: computed.fooBar,
  baz: state.baz
})(({ fooBar, baz }) => {
  return fooBar + baz
})
```

```marksy
<Warning>
All computeds has to be added to a module. This is what initializes them. So any composed computed
needs to live individually on a module. No worry though, a computed does not recalcuate unless being used.
</Warning>
```

## Dynamic computed

All computed receives a second argument called **get**. This argument can be used to manually extract state and props, very useful to optimize computed lists.

For example we have items with an array of user ids. We create a computed taking in **itemKey** as a prop, extracts the item and then iterates the userIds to grab the actual users.

```js
import { Compute } from 'cerebral'
import { state, props } from 'cerebral/proxy'

export const itemUsers = Compute({
  item: state.items[props.itemKey]
})(function getItemUsers({ item }, get) {
  return item.userIds.map((userId) => get(state.users[userId]))
})
```

We now grab an item based on a property passed in, _itemKey_. Then we iterate the userIds of this item and grab the actual related user. Now the computed will only update when the item itself or the grabbed users update.

```marksy
<Info>
You typically want to use dynamic computed in situations where optimizations is needed. Where you have large lists of entities related to other entities and you want to avoid too much recalculation.
</Info>
```

The computed we created here requires a prop and can be used in for example an action doing:

```js
import { computed } from 'cerebral/proxy'

function myAction({ get }) {
  const itemUsers = get(computed.itemUsers, { itemKey: '123' })
}
```

Or with a component, here showing with _React_:

```js
import React from 'react'
import { connect } from '@cerebral/react'
import { computed } from 'cerebral/proxy'

export default connect({
  users: computed.itemUsers
})(
  function ({ users }) {
    return ...
  }
)
```

And then you would pass the **itemKey** when using the component:

```js
<ItemUsers itemKey="123" />
```

Now this component only renders when the item changes or any related users. Even if users are added/removed from the item it will know about this en recalculate correctly.

```marksy
<Info>
Computeds that uses props and are connected to components will actually be cloned under the hood.
This ensures that when you use the same computed, for example for a list, they will all individually cache. When the component unmounts the clone is destroyed.
</Info>
```
