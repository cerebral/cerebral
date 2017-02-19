# Connect components

In Cerebral you always connect state where you need it. This give some benefits:

1. Cerebral will optimize the component
2. The debugger will know about this component and visualize its state dependencies and when it renders
3. Increased readability as every component explicitly tells you what state it needs and where it gets it from
4. You can safely move the component wherever you want without breaking chain of props passing

When you connect a component like this...

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  foo: state`app.title`
},
  function MyComponent ({title}) {
    return (
      <div>
        <h1>{title}</h1>
      </div>
    )
  }
)
```

...the component will be registered to the **Container** which is used to expose the controller. The *Container* actually has a register of all connected components in your application. This information is passed to the debugger and whenever Cerebral flushes out changes made to different state paths, the *Container* will figure out what components should render.

All connected components are automatically optimized, meaning that they will only render if a parent component passes a changed prop or the *Container* tells it to render.

You can also use classes where needed:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  foo: state`app.foo`
},
  class MyComponent extends React.Component {
    render () {
      return (
        <div>
          <h1>{this.props.title}</h1>
        </div>
      )
    }
  }
)
```
