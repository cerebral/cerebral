# Container
Exposes the controller to your components, allowing you to connect to it.

```js
import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import App from './components/App'

const controller = Controller()

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```
