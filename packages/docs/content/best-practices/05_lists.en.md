---
title: Lists
---

## Lists
Typically when working with lists you would:

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  items: 'items.data'
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

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  items: 'items.data'
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

export default connect((props) => ({
  item: `items.data.${props.itemKey}`
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

If you worry about order entities are most certainly added with a datetime, so you can typically sort on that.
