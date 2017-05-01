# Connect

## Exposing state
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  isLoading: state`app.isLoading`
},
  function App(props) {
    props.isLoading
  }
)
```

Expose state based on props passed to component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'

export default connect({
  isLoading: state`${props`module`}.isLoading`
},
  function App(props) {
    props.isLoading
  }
)
```

## Exposing signals
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {signal} from 'cerebral/tags'

export default connect({
  clicked: signal`app.somethingClicked`
},
  function App(props) {
    props.clicked
  }
)
```

Expose signals based on props passed to component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {signal, props} from 'cerebral/tags'

export default connect({
  clicked: signal`${props.module}.somethingClicked`
},
  function App(props) {
    props.clicked
  }
)
```

## Optimize rendering
Due to Cerebrals "render on path change" it is possible to optimize component rendering.

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  list: state`app.array.*`,
  map: state`app.map.*`,
},
  function App (props) {
    props.list // [0, 1, 2, 3]
    props.map // ['foo', 'bar']
  }
)
```

This component will only render when any keys are added or removed, meaning that nested change to a child does not cause a new render.

## Override props
You can add an additional function to connect that gives you full control of properties of the component and dependencies. The returned object from this function will be the exact props passed into the component.

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'

export default connect({
  foo: signal`app.foo`,
  clicked: signal`app.somethingClicked`
}, (dependencyProps, ownProps, resolve) => {
  return {}
},
  function App(props) {

  }
)
```

**dependencyProps** are the props you connected.

**props** are the props passed into the component by the parent.

**resolve** allows you to resolve computed etc., just like resolve in actions.
