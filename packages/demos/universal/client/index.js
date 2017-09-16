import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import { Container } from '@cerebral/react'
import Devtools from 'cerebral/devtools'
import App from './components/App'
import appModule from './modules/app'

const controller = Controller({
  devtools: Devtools({
    host: 'localhost:8787',
  }),
  modules: {
    app: appModule,
  },
})

render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.querySelector('#app')
)
