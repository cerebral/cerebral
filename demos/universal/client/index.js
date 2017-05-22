import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import App from './components/App'
import appModule from './modules/app'

const controller = Controller({
  modules: {
    app: appModule
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
