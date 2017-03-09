# Components

In Cerebral you connect state to components where you need it. This give some benefits:

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

...the component will be registered to the root **Container** component which is used to expose the controller. The *Container* actually has a register of all connected components in your application. This information is passed to the debugger and whenever Cerebral flushes out changes made to different state paths, the *Container* will figure out what components should render.

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

## Tutorial

**Before you start,** [load this BIN on Webpackbin](https://www.webpackbin.com/bins/-KdBDYEXCVwtPoaMAXgJ)

Now let's get that state displayed in our application.
First of all, we need to tell our component (App) to **connect** to the state.

So please change *App.js* to:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  title: state`title`
},
  function App ({title}) {
    return (
      <div>
        <h1>{title}</h1>
        <h2>Render state</h2>
      </div>
    )
  }
)
```

And voilà, your application should now look exactly the same, only getting the title from the state tree. And this is the essence of creating web applications. We define state and how that state should be displayed in the user interface.

We used something called a **tag** to define our state dependency. If you are unfamiliar with [template literals and template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) in JavaScript, you can read about them or just accept their awesome power :)

But our application does not do much. We have to introduce the concept of change. With the debugger, we can actually force a change to our state and make the UI update. Click the title state in the debugger, change it and hit enter. You will see the application display your changed state.

Thanks to...
```js
connect({
  title: state`title`
}, ...)
```
...we told Cerebral that this component is interested in the value on the path **title**, and we wanted it exposed as **title** to our component as well. Because this component now depends on the **title** state it gets rendered whenever the path has a change.

Congratulations, you have now created application state and exposed it to a component. You have now gained the power of translating the state of the application into something a user can understand. You will notice with Cerebral that this is a very clear separation. You define your application state in Cerebral and you use components to translate this state into a user interface.

### The component signature
Let us quickly talk about the syntax before moving on. The signature of connect most commonly uses two arguments:

**connect(dependencies, Component)**

We usually write this out as:

```js
connect({
  title: state`title`
},
  function App ({title}) {
    return (
      <div>
        <h1>{title}</h1>
        <h2>Render state</h2>
      </div>
    )
  }
)
```

Writing out the arguments on multiple lines and with indentation just makes it read better. It is also very nice to read the dependencies of your component first and then what the component does with those dependencies.

### Challenge

It's time for your first challenge!

- Add another state to the store called *subTitle*
- Connect *subTitle* to the App component and replace the content of the H2 with that state

If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
