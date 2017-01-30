import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import app from './modules/app'
import simple from './modules/simple'
import checkout from './modules/checkout'
import App from './components/App'

const controller = Controller({
  router: Router({
    routes: {
      '/': 'app.routed',
      '/simple': 'simple.routed',
      '/checkout': 'checkout.routed'
    },
    onlyHash: true
  }),
  devtools: Devtools(),
  modules: {
    app,
    simple,
    checkout
  }
})

render((
  <Container controller={controller} >
    <App />
  </Container>
), document.querySelector('#root'))
