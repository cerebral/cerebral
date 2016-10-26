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
      set(state`toast.message`, state`extendedValue`),
      wait(8000),
      set(state`toast.message`, '')
    ]
  }
})

function myAction1 ({input}) {
  input.value += ' extended by myAction1'
}

function myAction2 ({input, state}) {
  input.value += ' and also by myAction2'
  state.set('extendedValue', input.value)
  return ({
    aKeyAddedByMyAction2: 'testvalue'
  })
}

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
