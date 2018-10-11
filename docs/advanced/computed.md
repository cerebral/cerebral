# Compute

Normally you use state directly from the state tree, but sometimes you need to compute state. Typically filtering lists, grabbing the projects of a user, or other derived state. It is a good idea not to put this kind of logic inside your view layer, cause by creating a computed you can reuse the logic anywhere and it will automatically optimize the need to recalculate the value.

## Create a computed

Cerebral allows you to compute state that can be used in multiple contexts. Let us look at an example:

```js
import { state } from 'cerebral'

export const filteredList = (get) => {
  const items = get(state.items)
  const filter = get(state.filter)

  return items.filter((item) => item[filter.property] === filter.value)
}
```

A computed is just a function that receives the `get` argument. You use this argument to retrieve the state of the application. This retrieval is tracked, meaning that the computed automatically optimizes itself.

You attach a computed to the state of your application:

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
import { state, props } from 'cerebral'

export const fooBar = (get) => get(state.foo) + get(state.bar)

export const fooBarBaz = (get) => get(state.fooBar) + get(state.baz)
```

You point to computeds as normal state and you also use them that way.

## With props

You can also combine computeds with props. Either from a component or you can explicitly pass props when used in an action.

```js
import { state, props } from 'cerebral'

export const itemUsers = (get) => {
  const itemKey = get(props.itemKey)
  const item = get(state.items[itemKey])

  return item.userIds.map((userId) => get(state.users[userId]))
}
```

In this example we have items with an array of user ids. We create a computed taking in **itemKey** as a prop, extracts the item and then iterates the userIds to grab the actual users. Now this computed will only recalculate when the item or any of the users grabbed updates.

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
