function createDebounce (time) {
  let timer
  let currentResolver

  function debounce ({path}) {
    return new Promise(function (resolve) {
      if (timer) {
        currentResolver(path.discarded())
        currentResolver = resolve
      } else {
        timer = setTimeout(function () {
          currentResolver(path.accepted())
          timer = null
          currentResolver = null
        }, time)
        currentResolver = resolve
      }
    })
  }
  debounce.displayName = 'debounce - ' + time + 'ms'

  return debounce
}

export default function debounceFactory (time, continueBranch) {
  return [
    createDebounce(time), {
      accepted: continueBranch,
      discarded: []
    }
  ]
}
