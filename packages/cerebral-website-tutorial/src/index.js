import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { state, set, input } from 'cerebral/operators'
import HttpProvider from 'cerebral-provider-http'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    appTitle: 'Cerebral Tutorial App',
    toast: {
      message: 'no message yet'
    },
    originalValue: '',
    extendedValue: '',
    data: {}
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
      ...showToast()
    ],
    loadDataClicked: [
      ...showToast('Loading Data...', 1000),
      GetData,
      set(state`data`, input`result`),
      ...showToast('How cool is that. @{data.name} has @{data.stargazers_count} stars!', 5000)
    ]

  },
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    })
  ],
})

function myAction1({input}) {
  input.value += ' extended by myAction1'
}

function myAction2({input, state}) {
  input.value += ' and also by myAction2'
  return ({
    aKeyAddedByMyAction2: 'testvalue'
  })
}

function myAction3({input, state}) {
  input.value = input.value.toUpperCase()
  input.message = input.value
  state.set('extendedValue', input.value)
}


function GetData({input, state, http}) {
  return http.get("/repos/cerebral/cerebral")
    .then(response => ({
      result: response.result
    }))
}


function showToast(message, milliseconds) {
  function action({input, state, path}) {
    let msg = message
    let ms = milliseconds
    if (!msg && input) {
      msg = input.message
    }

    // replace the @{...} matches with current state value
    let reg = new RegExp(/@{.*?}/g)
    var matches = msg.match(reg)
    if (matches) {
      matches.forEach(m => {
        let cleanedPath = m.replace("@{", "").replace("}", "")
        msg = msg.replace(m, state.get(cleanedPath))
      })
    }

    if (!ms) {
      ms = 8000
    }
    state.set('toast.message', msg)
    return new Promise(function(resolve, reject) {
      window.setTimeout(function() {
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
  <Container controller={ controller }>
    <App />
  </Container>
  ), document.querySelector('#root'))
