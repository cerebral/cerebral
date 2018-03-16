import * as React from 'react'
import { render } from 'react-dom'
import Devtools from 'cerebral/devtools'
import { Controller, Container } from '@cerebral/fluent'
import App from './components/App'
import module from './module'

import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'
import './styles.css'

const controller = Controller(module, {
  devtools: Devtools({
    host: 'localhost:8686',
  }),
})

render(
  <Container controller={controller}>
    <App />,
  </Container>,
  document.getElementById('root')
)
