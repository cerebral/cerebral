import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import Router from '@cerebral/router'
import app from './modules/app'
import simple from './modules/simple'
import App from './components/App'
import FormsProvider from '@cerebral/forms'

const controller = Controller({
  router: Router({
    routes: {
      '/': 'app.routed',
      '/simple': 'simple.routed'
    },
    onlyHash: true
  }),
  devtools: Devtools({ remoteDebugger: 'localhost:8787' }),
  modules: {
    app,
    simple
  },
  providers: [
    FormsProvider()
  ]
})

render((
  <Container controller={controller} >
    <App />
  </Container>
), document.querySelector('#root'))
