# Controller

Cerebral is what we call a controller. It controls the requests for state change, runs them and notifies the UI when an update is due. It is in complete control of your application and knows everything that is going on. That is why the debugger can give you so much insight into your running application.

Your application will have one single controller:

```js
import {Controller} from 'cerebral'

const controller = Controller({})
```

The controller is where you define how your application is going to work. Everything from the state, to signals, providers and modules.

```js
import {Controller} from 'cerebral'

const controller = Controller({
  state: {},
  signals: {},
  modules: {},
  providers: []
})
```

The controller will then be exposed to your components.

```js
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import {render} from 'react-dom'
import App from './components/App'

const controller = Controller({
  state: {},
  signals: {},
  modules: {},
  providers: []
})

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

The **Container** exposes the controller on the *context*, allowing any component to register to it.
