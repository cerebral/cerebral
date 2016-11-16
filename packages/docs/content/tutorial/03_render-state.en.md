---
title: ch02. Render state
---

## Render state

**Load up chapter 02** - [Preview](02)

Now lets get that state displayed in our application.
First of all we need to tell our component (App) to **connect** to the state.

So please change the *src/components/App/index.js* to:

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  title: 'title'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
      </div>
    )
  }
)
```

And voilà, your application should now display the title state. And this is the essence of creating web applications. We define state and how that state should be displayed in the user interface.

But our application does not do much. We have to introduce the concept of change. With the debugger we can actually force a change to our state and make the UI update. Click the title state in the Chrome debugger, change it and hit enter. You will see the application display your changed state.

Thanks to
```js
connect({
  title: 'title'
}, ...)
```
we told Cerebral that this component is interested in the value on the path **title**, and we wanted it exposed as **title** to our component as well. Because this component now depends on the **title** state it gets rendered whenever the path has a change.

Congratulations, you have now created application state and exposed it to a component. You have now gained the power of translating the state of the application into something a user can understand. You will notice with Cerebral that this is a very clear separation. You define your application state in Cerebral and you use components to translate this state into a user interface.

### Challenge

It's time for your first challenge!

- Add another state to the store called *subTitle*
- Connect *subTitle* to the App component and display it in a *H3* element
