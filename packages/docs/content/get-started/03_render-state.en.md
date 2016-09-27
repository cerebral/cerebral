---
title: Render state
---

## Render state

In the file *src/components/App/index.js* you will find the only component defined for your application.

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default function App() {
  return (
    <div>
      <h1>Hello world!</h1>
    </div>
  )
}
```

Now we want to connect the state we defined and use it.

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  title: 'title'
},
  function App({title}) {
    return (
      <div>
        <h1>{title}</h1>
      </div>
    )
  }
)
```

We now told Cerebral that this component is interested in the value on the path **title**, and we wanted it exposed as **title** to our component as well.

When you now refresh the application it will display **"Hello Cerebral!"** instead. Congrats! You have now translated state into user interface.

If you look in the debugger and click "Hello Cerebral!" in the model you can change the value and see it update your application. This is one of the tools the Cerebral debugger provides to help you debug and work on your application.
