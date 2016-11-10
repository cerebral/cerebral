function createDebounce (time, execution = {timer: null, resolve: null}) {
  function debounce ({path}) {
    return new Promise(function (resolve) {
      if (execution.timer) {
        execution.resolve(path.discarded())
        clearTimeout(execution.timer)
      }

      execution.timer = setTimeout(function () {
        execution.resolve(path.accepted())
        execution.timer = null
        execution.resolve = null
      }, time)
      execution.resolve = resolve
    })
  }
  debounce.displayName = 'debounce - ' + time + 'ms'

  return debounce
}

function debounceFactory (time, continueBranch) {
  return [
    createDebounce(time), {
      accepted: continueBranch,
      discarded: []
    }
  ]
}

debounceFactory.shared = () => {
  const execution = {timer: null, resolve: null}

  return function debounceSharedFactory (time, continueBranch) {
    return [
      createDebounce(time, execution), {
        accepted: continueBranch,
        discarded: []
      }
    ]
  }
}

export default debounceFactory
