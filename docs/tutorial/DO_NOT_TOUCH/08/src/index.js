import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import App from './components/App'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import HttpProvider from 'cerebral-provider-http'
import {set, debounce} from 'cerebral/operators'
import {state, input, string} from 'cerebral/tags'

const toastDebounce = debounce.shared()
function showToast (message, ms, type = null) {
  return [
    set(state`toast`, {type}),
    set(state`toast.message`, message),
    toastDebounce(ms), {
      continue: [
        set(state`toast`, null)
      ],
      discard: []
    }
  ]
}

function getRepo (repoName) {
  function get ({http, path}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then(response => path.success({data: response.result}))
      .catch(error => path.error({data: error.result}))
  }

  return get
}

function setStarsSum ({state}) {
  state.set('starsSum',
    state.get('repos.cerebral.stargazers_count') +
    state.get('repos.addressbar.stargazers_count')
  )
}

const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management',
    toast: null,
    repos: {},
    starsSum: 0
  },
  signals: {
    buttonClicked: [
      [
        ...showToast('Loading data for repos', 2000),
        getRepo('cerebral'), {
          success: [set(state`repos.cerebral`, input`data`)],
          error: []
        },
        getRepo('addressbar'), {
          success: [set(state`repos.addressbar`, input`data`)],
          error: []
        }
      ],
      setStarsSum,
      ...showToast(string`The repos has a total star count of ${state`starsSum`}`, 4000, 'success')
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
