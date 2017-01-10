import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { set, wait, state } from 'cerebral/operators'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    appTitle: 'Cerebral Tutorial App',
    toast: {
      message: 'no message yet'
    }
  },
  signals: {
    buttonClicked: [
      set(state`toast.message`, 'Button Clicked!'),
      wait(4000),
      set(state`toast.message`, '')
    ]
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
