import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { state, set, input } from 'cerebral/operators'
import HttpProvider from 'cerebral-provider-http'

const controller = Controller(
  {
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
      data: {},
      cerebralStarsCount: 0,
      cerebralDebuggerStarsCount: 0,
      totalStarsCount: 0
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
      ],
      getRepoInfoClicked: [
        set(state`repoName`, input`value`),
        ...showToast('Loading Data for repo: @{repoName}', 0),
        GetData('/repos/cerebral/'),
        {
          success: [
            set(state`data`, input`result`),
            ...showToast('How cool is that. @{repoName} has @{data.subscribers_count} subscribers and @{data.stargazers_count} stars!', 0, 'success')
          ],
          error: [
            set(state`data`, input`result`),
            ...showToast('Ooops something went wrong: @{data.message}', 0, 'error')
          ]
        },
        ...showToast('Load Data finished...', 2000)
      ],
      starCountClicked: [
        ...showToast('Counting Stars...', 0),
        [
          ...showToast('Get Cerebral Stars...', 0),
          GetData('/repos/cerebral/', 'cerebral'),
          {
            success: [
              set(state`cerebralStarsCount`, input`result.stargazers_count`)
            ],
            error: [
              set(state`data`, input`result`),
              ...showToast('Ooops something went wrong loading the StarCount for Cerebral: @{data.message}', 0, 'error')
            ]
          },
          ...showToast('Get Cerebral-Debugger Stars...', 0),
          GetData('/repos/cerebral/', 'cerebral-debugger'),
          {
            success: [
              set(state`cerebralDebuggerStarsCount`, input`result.stargazers_count`)
            ],
            error: [
              set(state`data`, input`result`),
              ...showToast('Ooops something went wrong loading the StarCount for Cerebral-Debugger: @{data.message}', 0, 'error')
            ]
          }
        ],
        addStars,
        ...showToast('Total Stars: @{totalStarsCount}', 5000, 'success')
      ]
    },
    providers: [
      HttpProvider({
        baseUrl: 'https://api.github.com'
      })
    ]
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

function addStars ({state}) {
  state.set('totalStarsCount', state.get('cerebralStarsCount') + state.get('cerebralDebuggerStarsCount'))
}

function GetData (url, repoName) {
  function action ({input, state, http, path}) {
    let repo = repoName || input.value
    return http.get(url + repo)
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
  action.displayName = `GetData(${url}, ${repoName})`
  return action
}

function showToast (message, milliseconds, type) {
  var isAsync = milliseconds || (message && milliseconds === undefined) || (message === undefined && milliseconds === undefined)
  function action ({input, state, path}) {
    // api sugar to make showToast(2000), showToast() work
    let ms = 0
    let msg = ''
    if (message && milliseconds === undefined) {
      ms = message
      msg = ''
    } else if (milliseconds) {
      ms = milliseconds
    } else if (message === undefined && milliseconds === undefined) {
      ms = 5000
    }
    msg = message || input.value
    // replace the @{...} matches with current state value
    if (msg) {
      let reg = new RegExp(/@{.*?}/g)
      var matches = msg.match(reg)
      if (matches) {
        matches.forEach(m => {
          let cleanedPath = m.replace('@{', '').replace('}', '')
          msg = msg.replace(m, state.get(cleanedPath))
        })
      }
    }
    let newMsg = {
      msg: msg,
      type: type,
      timestamp: Date.now(),
      id: Date.now() + '_' + Math.floor(Math.random() * 10000),
      grouped: !isAsync
    }
    state.unshift('toast.messages', newMsg)
    if (isAsync) {
      return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
          resolve(path.timeout({
            id: newMsg.id
          }))
        }, ms)
      })
    }
  }
  action.displayName = 'showToast'
  if (!isAsync) {
    return [action]
  }
  return [action, {
    timeout: [
      removeToast
    ]
  }
  ]
}

function removeToast ({input, state}) {
  let res1 = state.get('toast.messages').filter(function (msg) {
    return msg.id === input.id
  })
  let res = state.get('toast.messages').filter(function (msg) {
    return !(msg.id === input.id || (msg.grouped && msg.timestamp <= res1[0].timestamp))
  })
  state.set('toast.messages', res)
}

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
