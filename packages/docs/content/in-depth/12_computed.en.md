---
title: Computed
---

## Computed

Very often the components needs to produce state based on a combination of other state. A very typical example is to show items of a list based on a dynamic limit. The whole list is stored in your state tree, but you only want to show for example the 10 latest. Instead of defining this in the component itself, you can use a **computed**. The signature is very much like connecting state to a component, but instead of returning a user interface description, it returns a value.

```js
import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  limit: state`items.limit`,
  items: state`items.list`
}, ({limit, items}) => {
  return items.filter((item, index) => index < limit)
})
```

To use this computed in your component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import limitedList from '../../computed/limitedList'

export default connect({
  limitedList: limitedList
},
  function List(props) {
    props.limitedList
  }
)
```

It would also be possible to pass in the limit as a property:

```js
import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  items: state`items.list`
}, (props) => {
  return props.items.filter((item, index) => index < props.limit)
})
```

```js
import React from 'react'
import {connect} from 'cerebral/react'
import limitedList from '../../computed/limitedList'

export default connect({
  limitedList: limitedList.props({limit: 10})
},
  function List(props) {
    props.limitedList
  }
)
```

The computed values are automatically cached.
