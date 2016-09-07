function createDebounce(time) {
  var timer
  var currentResolver

  function debounce(context) {
    return new Promise(function (resolve) {
      if (timer) {
        currentResolver(context.path.discarded())
        currentResolver = resolve
      } else {
        timer = setTimeout(function () {
          currentResolver(context.path.accepted())
          timer = null
          currentResolver = null
        }, time)
        currentResolver = resolve
      }
    })
  }
  debounce.displayName = 'debounce - ' + time + 'ms'

  return debounce;
}

function debounceFactory(time, continueBranch) {
  return [
    createDebounce(time), {
      accepted: continueBranch,
      discarded: []
    }
  ];
}

module.exports = debounceFactory
