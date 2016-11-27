---
title: Constants
---

## Constants

When building larger applications it can be a good idea to define paths as constants. For example:

*src/pathConstants.js*
```js
export const ADMIN = 'admin'
export const FEED = 'home.feed'
```

Inside your actions your can now do:

```js
import {ADMIN} from '../../pathConstants'

function someAction({paths, state}) {
  state.set(`${ADMIN}.isLoading`, true)
}
```

And in components you can:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {ADMIN} from '../../pathConstants'

export default connect({
  isLoading: `${ADMIN}.isLoading`
},
  function MyComp(props) {

  }
)
```

Using constants in general makes your codebase less fragile to changes. You might want to change around where modules are defined and using constants will let you safely do that and change the path at one location.
