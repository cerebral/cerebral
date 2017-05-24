function createDebounce (time, execution) {
  function debounce ({path}) {
    return new Promise(function (resolve) {
      if (execution.timer) {
        execution.resolve(path.discard())
        clearTimeout(execution.timer)
      }

      execution.timer = setTimeout(function () {
        execution.resolve(path.continue())
        execution.timer = null
        execution.resolve = null
      }, time)
      execution.resolve = resolve
    })
  }
  debounce.displayName = 'debounce - ' + time + 'ms'

  return debounce
}

function debounceFactory (time) {
  // New execution on every call
  const execution = {timer: null, resolve: null}

  return createDebounce(time, execution)
}

debounceFactory.shared = () => {
  // Shared execution
  const execution = {timer: null, resolve: null}

  return function debounceSharedFactory (time) {
    return createDebounce(time, execution)
  }
}

export default debounceFactory
