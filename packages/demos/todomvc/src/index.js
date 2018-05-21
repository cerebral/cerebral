import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'
import './styles.css'

import React from 'react'
import { render } from 'react-dom'
import { Container } from '@cerebral/react'
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'
import main from './main'
import AppComponent from './components/App'

const app = App(main, {
  devtools: Devtools({ host: 'localhost:8686' }),
})

render(
  <Container app={app}>
    <AppComponent />
  </Container>,
  document.querySelector('#root')
)
