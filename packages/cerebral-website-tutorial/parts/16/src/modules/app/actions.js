import * as computeds from '../../computeds/getStars'

export function getData (url, repoName) {
  function action ({input, state, http, path, logger}) {
    logger.time('request time')
    let repo = repoName || input.value
    return http.get(url + repo)
      .then(response => {
        logger.timeEnd('request time')
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
  action.displayName = `getData(${url}, ${repoName})`
  return action
}

export function showToast (message, milliseconds, type) {
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

    // replace the @C{...} matches with current computed value
    if (msg) {
      let reg = new RegExp(/@C{.*?}/g)
      var matches = msg.match(reg)
      if (matches) {
        matches.forEach(m => {
          let cleanedPath = m.replace('@C{', '').replace('}', '')
          msg = msg.replace(m, state.compute(computeds[cleanedPath]))
        })
      }
      // replace the @{...} matches with current state value
      reg = new RegExp(/@{.*?}/g)
      matches = msg.match(reg)
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
    state.unshift('app.toast.messages', newMsg)
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
  let res1 = state.get('app.toast.messages').filter(function (msg) {
    return msg.id === input.id
  })
  let res = state.get('app.toast.messages').filter(function (msg) {
    return !(msg.id === input.id || (msg.grouped && msg.timestamp <= res1[0].timestamp))
  })
  state.set('app.toast.messages', res)
}
