# Compute

Computeds calculate and cache derived state values. Using computeds helps to keep logic out of the application view components and improves performance.

```js
import { state } from 'cerebral'

export const title = (get) => {
  return `Hi ${get(state`user.name`)}`
}
```

You use the **get** function to retrieve state and other computed values from the state tree. It will automatically track the computed to optimally figure out when it needs to recalculate.

You attach these computeds directly to your state:

```js
import { title } from './computed'

export default {
  state: {
    user: {
      name: 'Bob'
    },
    title
  }
}
```

To use a computed just point to it as if it was normal state, here shown with React:

```js
import React from 'react'
import { state } from 'cerebral'
import { connect } from '@cerebral/react'

export default connect(
  {
    hello: state`title`
  },
  function App({ hello }) {
    return (
      <h1>{title}</h1>
    )
  }
)
```