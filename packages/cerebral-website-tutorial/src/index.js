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
      messages: []
    },
    originalValue: '',
    extendedValue: '',
    repoName: 'cerebral',
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
    getRepoInfoClicked: [
      set(state`repoName`, input`value`),
      ...showToast('Loading Data for repo: @{repoName}', 2000),
      GetData,
      set(state`data`, input`result`),
      ...showToast('How cool is that. @{repoName} has @{data.subscribers_count} subscribers and @{data.stargazers_count} stars!', 5000)
    ]

  },
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    })
  ]
})

function myAction1 ({input}) {
  input.value += ' extended by myAction1'
}

function myAction2 ({input, state}) {
  input.value += ' and also by myAction2'
  return ({
    aKeyAddedByMyAction2: 'testvalue'
  })
}

function myAction3 ({input, state}) {
  input.value = input.value.toUpperCase()
  input.message = input.value
  state.set('extendedValue', input.value)
}

function GetData ({input, state, http}) {
  return http.get('/repos/cerebral/' + input.value)
    .then(response => ({
      result: response.result
    }))
}

function popMessage ({state}) {
  state.pop('toast.messages')
}

function showToast (message, milliseconds) {
  function action ({input, state, path}) {
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
        let cleanedPath = m.replace('@{', '').replace('}', '')
        msg = msg.replace(m, state.get(cleanedPath))
      })
    }
    if (!ms) {
      ms = 8000
    }
    state.unshift('toast.messages', msg)
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () {
        resolve({})
      }, ms)
    })
  }
  action.displayName = 'showToast'

  return [
    action,
    popMessage
  ]
}
render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
