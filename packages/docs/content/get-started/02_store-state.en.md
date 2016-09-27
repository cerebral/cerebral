---
title: Store state
---

## Store state

All interactive user interfaces has state. Cerebral stores this state in a single model. The model holds the description of the state your application is in, and it also holds any data downloaded from the server. Since Cerebral uses a single model the debugger can visualize the whole state description of the application. Lets try it.

In the *src/main.js* file Cerebral is already prepared for you. The **Controller** factory has been imported, we just need to use it to create an instance of the controller for your application.

```js
import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'

const controller = Controller({
  state: {
    title: 'Hello Cerebral!'
  }
})

render((
  <App />
), document.querySelector('#app'))
```

To expose the controller to React we need to use the **Container**.

```js
import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'

const controller = Controller({
  state: {
    title: 'Hello Cerebral!'
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

Congratulations, you have now created application state and exposed it to a view layer. You can now translate the state of the application into something a user can understand. You will notice with Cerebral that this is a very clear separation. You define your application state in Cerebral and a view layer of choice will use this state to produce a user interface.

Did you notice that when you refreshed your application the state is shown in the debugger?
