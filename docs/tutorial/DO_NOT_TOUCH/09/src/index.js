import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import App from './components/App'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import HttpProvider from 'cerebral-provider-http'
import {set, when, debounce} from 'cerebral/operators'
import {state, props, string} from 'cerebral/tags'
import starsCount from './computeds/starsCount'

const toastDebounce = debounce.shared()
function showToast (message, ms) {
  if (!ms) {
    return [
      set(state`toast`, message)
    ]
  }

  return [
    set(state`toast`, message),
    toastDebounce(ms), {
      continue: [
        set(state`toast`, null)
      ],
      discard: []
    }
  ]
}

function getRepo (repoName) {
  function get ({http}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then((response) => {
        return {[repoName]: response.result}
      })
      .catch((error) => {
        return {error: error.result}
      })
  }

  return get
}

const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management',
    toast: null,
    repos: {}
  },
  signals: {
    buttonClicked: [
      ...showToast(string`Loading data for repos`),
      [
        getRepo('cerebral'),
        getRepo('addressbar')
      ],
      when(props`error`), {
        true: [
          ...showToast(string`Error: ${props`error`}`, 5000)
        ],
        false: [
          set(state`repos.cerebral`, props`cerebral`),
          set(state`repos.addressbar`, props`addressbar`),
          ...showToast(string`The repos have ${starsCount} stars`, 5000)
        ]
      }
    ]
  },
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    })
  ]
})

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
