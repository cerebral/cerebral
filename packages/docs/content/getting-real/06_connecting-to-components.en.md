---
title: Connecting to components
---

## Connecting to components

You connect Cerebral to components to expose state and signals. Typically you would do something like this:

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  foo: 'app.foo'
},
  function MyComponent({foo}) {
    return (
      <div>
        {foo}
      </div>
    )
  }
)
```

To expose signals you similarely do:

```js
export default connect({
  foo: 'app.foo'
}, {
  clicked: 'app.clicked'
},
  function MyComponent({foo, clicked}) {
    return (
      <div onClick={() => clicked()}>
        {foo}
      </div>
    )
  }
)
```

Both state and signals can optionally be defined with a function that returns an object. These functions receives the props passed to the component:

```js
export default connect((props) => ({
  user: `app.users.${props.userId}`
}),
  function MyComponent({foo, clicked}) {
    return (
      <div onClick={() => clicked()}>
        {foo}
      </div>
    )
  }
)
```

When Cerebral connects to a component it will take control of its rendering. When one of its state dependencies updates, or some parent component passes in some new props, it will rerender.
