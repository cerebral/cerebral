import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { set, state, input } from 'cerebral/operators'

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
      ...showToast('Button clicked!', 1000)
    ],
    saveButtonClicked: [
      set(state`originalValue`, input`value`),
      myAction1,
      myAction2,
      myAction3,
      set(state`extendedValue`, input`value`),
      ...showToast()
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
function myAction3 ({input, state}) {
  return ({
    value: input.value.toUpperCase()
  })
}

function showToast (message, milliseconds) {
  function action ({input, state, path}) {
    let msg = message || input.value
    let ms = milliseconds
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
  return [action,
    set(state`toast.message`, '')
  ]
}
render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
