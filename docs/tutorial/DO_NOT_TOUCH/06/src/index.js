import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import App from './components/App'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import {set, wait} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

function showToast (message, ms) {
  return [
    set(state`toast`, message),
    wait(ms),
    set(state`toast`, null)
  ]
}

const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management',
    toast: null
  },
  signals: {
    buttonClicked: [
      ...showToast(props`message`, 1000)
    ]
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
