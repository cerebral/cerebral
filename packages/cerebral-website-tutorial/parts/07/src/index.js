import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { set, state, wait, input } from 'cerebral/operators'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    appTitle: 'Cerebral Tutorial App',
    toast: {
      message: 'no message yet'
    },
    originalValue: '',
    extendedValue: ''
  },
  signals: {
    buttonClicked: [
      set(state`toast.message`, 'Button Clicked!'),
      wait(4000),
      set(state`toast.message`, '')
    ],
    saveButtonClicked: [
      set(state`originalValue`, input`value`),
      myAction1,
      myAction2,
      set(state`extendedValue`, input`value`),
      set(state`toast.message`, input`value`),
      wait(8000),
      set(state`toast.message`, '')
    ]
  }
})
function myAction1 ({input}) {
  return {
    value: input.value + ' extended by myAction1'
  }
}

function myAction2 ({input}) {
  return ({
    value: input.value + ' and also by myAction2',
    aKeyAddedByMyAction2: 'testvalue'
  })
}

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
