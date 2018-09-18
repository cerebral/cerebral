# Compute

Normally you use state directly from the state tree, but sometimes you need to compute state. Typically filtering lists, grabbing the projects of a user, or other derived state. It is a good idea not to put this kind of logic inside your view layer, cause by creating a computed you can reuse the logic anywhere and it will automatically optimize the need to recalculate the value.

## Create a computed

Cerebral allows you to compute state that can be used in multiple contexts. Let us look at an example:

```js
import { Compute, state } from 'cerebral'

export const filteredList = Compute(
  {
    items: state.items,
    filter: state.filter
  },
  function filterList({ items, filter }) {
    return items.filter((item) => item[filter.property] === filter.value)
  }
)
```

When we call a computed we give it the dependencies to produce our calculated value. This returns a function which you can call giving a callback that receives the dependencies.

```marksy
<Info>
As you can see a Compute follows the same signature as your views. Actually, views are treated the same way as computeds, they just return a UI description instead of a value of your choice.
</Info>
```

You attach a computed to the state of your application

```js
import { filteredList } from './computed'

export default {
  state: {
    items: [],
    filter: {
      property: 'isAwesome',
      value: true
    },
    filteredList
  }
}
```

## With components

Here shown with *React*:

```js
import { state } from 'cerebral'

connect(
  {
    list: state.filteredList
  },
  function List({ list }) {
    return <ul>{list.map((item) => <li>{item.title}</li>)}</ul>
  }
)
```

## With factories

```js
import { when } from 'cerebral/factories'
import { state } from 'cerebral'

export const mySequence = [
  when(state.appIsAwesome),
  {
    true: [],
    false: []
  }
]
```

## With actions

```js
import { state } from 'cerebral'

export function myAction({ get }) {
  const filteredList = get(state.filteredList)
}
```

## With other proxies

```js
import { state } from 'cerebral'
import { set } from 'cerebral/factories'

export const mySequence = set(state[state.somePropKey].bar, 'baz')
```

## Computing computeds

```js
import { Compute, state, props } from 'cerebral'

export const fooBar = Compute(
  {
    foo: state.foo,
    bar: props.bar
  },
  ({ foo, bar }) => {
    return foo + bar
  }
)

export const fooBarBaz = Compute(
  {
    fooBar: state.fooBar,
    baz: state.baz
  },
  ({ fooBar, baz }) => {
    return fooBar + baz
  }
)
```

## Dynamic computed

All computed receives a property called **get**. This function can be used to manually extract state and props, very useful to optimize computed lists.

```js
import { Compute, state, props } from 'cerebral'

export const itemUsers = Compute(
  {
    item: state.items[props.itemKey]
  },
  function getItemUsers({ item, get }) {
    return item.userIds.map((userId) => get(state.users[userId]))
  }
)
```

In this example we have items with an array of user ids. We create a computed taking in **itemKey** as a prop, extracts the item and then iterates the userIds to grab the actual users. Now this computed will only recalculate when the item updates or any of the users grabbed. It will not update if any other users update, which would be the case if you were depending on the users state itself.

```marksy
<Info>
You typically want to use dynamic computed in situations where optimizations is needed. Where you have large lists of entities related to other entities and you want to avoid too much recalculation.
</Info>
```

The computed we created here requires a prop and can be used in for example an action doing:

```js
import { state } from 'cerebral'

function myAction({ get }) {
  const itemUsers = get(state.itemUsers, { itemKey: '123' })
}
```

Or with a component, here showing with *React*:

```js
import React from 'react'
import { connect } from '@cerebral/react'
import { state } from 'cerebral'

export default connect(
  {
    users: state.itemUsers
  },
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
This ensures that when you use the same computed, for example for a list, they will all individually cached. When the component unmounts the clone is destroyed.
</Info>
```
