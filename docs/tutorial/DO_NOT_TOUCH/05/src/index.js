import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import App from './components/App'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import {set, wait} from 'cerebral/operators'
import {state} from 'cerebral/tags'

const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management',
    toast: null
  },
  signals: {
    buttonClicked: [
      set(state`toast`, 'Button Clicked!'),
      wait(4000),
      set(state`toast`, null)
    ]
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
