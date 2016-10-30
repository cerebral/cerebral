import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { state, set, input, pop } from 'cerebral/operators'
import HttpProvider from 'cerebral-provider-http'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  state: {
    title: 'Hello from Cerebral2!',
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
      [
        GetData,
        {
          success: [
            set(state`data`, input`result`),
            ...showToast('How cool is that. @{repoName} has @{data.subscribers_count} subscribers and @{data.stargazers_count} stars!', 5000, "success")
          ],
          error: [
            set(state`data`, input`result`),
            ...showToast('Ooops something went wrong: @{data.message}', 5000, "error")
          ]
        }
      ],
      showToast('GetData finished', 2000)
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


function GetData({input, state, http, path}) {
  return http.get("/repos/cerebral/" + input.value)
    .then(response => {
      return path.success({
        result: response.result
      })
    })
    .catch(error => {
      return path.error({
        result: error.result
      })
    })
}

function showToast(message, milliseconds, type) {
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
    state.unshift('toast.messages', {
      msg: msg,
      type: type,
      id: Date.now()
    })
    return new Promise(function(resolve, reject) {
      window.setTimeout(function() {
        resolve({})
      }, ms)
    })
  }
  action.displayName = 'showToast'

  return [
    action,
    pop(state`toast.messages`)
  ]
}
render((
  <Container controller={ controller }>
    <App />
  </Container>
  ), document.querySelector('#root'))
