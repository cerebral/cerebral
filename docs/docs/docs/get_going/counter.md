# Example: Counter

*controller.js*
```js
import {Controller} from 'cerebral'

function increase ({state}) {
  state.set('count', state.get('count') + 1)
}

function decrease ({state}) {
  state.set('count', state.get('count') - 1)
}

const controller = Controller({
  state: {
    count: 0
  },
  signals: {
    increaseClicked: [increase],
    decreaseClicked: [decrease]
  }
})

export default controller
```

*App.js*
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'

export default connect({
  count: state`count`,
  increaseClicked: signal`increaseClicked`,
  decreaseClicked: signal`decreaseClicked`,
},
  function App ({count, increaseClicked, decreaseClicked}) {
    return (
      <div>
        <button
          onClick={() => increaseClicked()}
        > + </button>
        {count}
        <button
          onClick={() => decreaseClicked()}
        > - </button>
      </div>
    )
  }
)
```

*main.js*
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
