---
title: Lists
---

## Lists
Typically when working with lists you would:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  items: state`app.items`
},
  function Items(props) {
    return (
      <ul>
        {props.items.map((item, index) => {
          <Item key={index} item={item} />
        })}
      </ul>
    )
  }
)
```

This is perfectly okay if the list is not very large or the list is not related to entities (objects with ids). But when working with Cerebral and entities you should favor storing them as a map instead. That means:

```js
{
  items: {
    id1: {},
    id2: {},
    id3: {}
  }
}
```

This gives you three benefits:

1. If you give each item a client side id, for example using [uuid](https://www.npmjs.com/package/uuid), you can very easily optimistically add new items without worrying about their place in some list. They will get a client side id and can always be referenced by that

2. It will be faster and less code to look up entities when you have an id to reference them with. You just point to **items.id2** and you have the item. No array search

3. Your components can connect directly to an entity

So let us imagine we have a map of items instead:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  items: state`app.items`
},
  function List(props) {
    return (
      <ul>
        {Object.keys(props.items).map((itemKey) => {
          <Item key={itemKey} itemKey={itemKey} />
        })}
      </ul>
    )
  }
)
```

We are now giving the component only a reference to the item it should connect to. That means inside our **Item** component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'

export default connect((props) => ({
  item: state`app.items.${props`itemKey`}`
}),
  function Item(props) {
    return (
      <div>
        {props.item.title}
      </div>
    )
  }
)
```

This component is now optimized, it is more explicit about where it gets its state from and you also got the other benefits mentioned above.

Typically you would put a computed in between the component and the items, for sorting and filtering reasons, only returning the keys. For example, returning the keys in sorted order by *datetime*:

```js
import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  items: state`app.items`
}, (props) => {
  return Object.keys(props.items)
    .sort((itemAKey, itemBKey) => {
      const itemA = props.items[itemAKey]
      const itemB = props.items[itemBKey]

      if (itemA.datetime > itemB.datetime) {
        return 1
      } else if (itemA.datetime < itemB.datetime) {
        return -1
      }

      return 0
    })
})
```

Now in the component you just do:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import itemsKeys from '../computed/itemsKeys'

export default connect({
  itemsKeys
},
  function List(props) {
    return (
      <ul>
        {props.itemsKeys.map((itemKey) => {
          <Item key={itemKey} itemKey={itemKey} />
        })}
      </ul>
    )
  }
)
```

### Identifying current item
Sometimes you want to highlight the current item in a list. You might be tempted to add this logic in the **Item** components:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'

export default connect((props) => ({
  item: state`app.items.${props`itemKey`}`,
  currentItemKey: state`app.currentItemKey`
}),
  function Item(props) {
    return (
      <div className={`item ${props.itemKey === props.currentItemKey} ? 'selected' : ''`}>
        {props.item.title}
      </div>
    )
  }
)
```

But this will make every item in the list render again when **app.currentItemKey** changes. A better approach is to:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import itemsKeys from '../computed/itemsKeys'
import {state} from 'cerebral/tags'

export default connect({
  itemsKeys,
  currentItemKey state`app.currentItemKey`
},
  function List(props) {
    return (
      <ul>
        {props.itemsKeys.map((itemKey) => {
          <Item
            key={itemKey}
            itemKey={itemKey}
            selected={itemKey === props.currentItemKey}
          />
        })}
      </ul>
    )
  }
)
```

Now only the component that actually changes its **selected** prop will do a new render.

Lists are the UI output that affects performance the most. Usually it is no problem with over-rendering, cause there are no changes to the DOM anyways, but on big lists React/Inferno can get into problems if it is not optimized. Luckily Cerebral does this for you when you follow this convention.
