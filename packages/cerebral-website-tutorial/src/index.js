import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { set } from 'cerebral/operators'

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
      showToast('Button clicked!', 1000),
      set('state:toast.message', '')
    ],
    saveButtonClicked: [
      set('state:originalValue', 'input:value'),
      myAction1,
      myAction2,
      myAction3,
      showToast(),
      set('state:toast.message', '')
    ]
  }
})

function myAction1 ({input}) {
  input.value += ' extended by myAction1'
}

function myAction2 ({input, state}) {
  input.value += ' and also by myAction2'
}

function myAction3 ({input, state}) {
  input.value = input.value.toUpperCase()
  input.message = input.value
  state.set('extendedValue', input.value)
}

function showToast (message, milliseconds) {
  function action ({input, state, path}) {
    let msg = message
    let ms = milliseconds
    if (!msg && input) {
      msg = input.message
    }
    if (!ms) {
      ms = 8000
    }
    state.set('toast.message', msg)
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () {
        resolve({})
      }, ms)
    })
  }
  action.displayName = 'showToast'
  return action
}
render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
