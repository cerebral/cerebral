import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import App from './components/App'

const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!'
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
