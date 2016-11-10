import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import App from './components/App'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools()
})

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
