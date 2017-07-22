# Components

In Cerebral you connect state to components where you need it. This give some benefits:

1. Cerebral will optimize the component
2. The debugger will know about this component and visualize its state dependencies and when it renders
3. Increased readability as every component explicitly tells you what state and signals it needs and where it gets it from
4. You can safely move the component wherever you want without breaking chain of props passing

Cerebral supports numerous view layers. They conceptually work the same way, but has different implementation details. Choose the view layer that makes sense to you and your team. We will move on using **React**, but have a look at the API section to find more out about **Inferno**, **AngularJS**, **Preact** and **Vue**.

When you render your application you use the **Container** component to expose the controller to the rest of your components...

```js
import React from 'react'
import {render} from 'react-dom'
import {Container} from 'cerebral/react'
import controller from './controller'
import App from './App'

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

When you connect a component like this...

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  title: state`title`
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

...the component will be registered to Cerebral. Cerebral actually has a register of all *connected* components in your application. This information is passed to the debugger and whenever Cerebral flushes out changes made to different state paths, it will know what components should render.

All connected components are automatically optimized, meaning that they will only render if a parent component passes a changed prop or Cerebral explicitly tells it to render.

To get more in-depth information about **connect**, please visit the [API chapter](http://cerebraljs.com/docs/api/components.html).
