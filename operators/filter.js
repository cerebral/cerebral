function filterInputFactory(path, filterFunc) {
  function filterInput(context) {
    var fromValue

    if (typeof context[path[0]].get === 'function') {
      var fromTarget = path.shift()

      fromValue = context[fromTarget].get(path)
    } else {
      fromValue = path.reduce(function (currentPath, key) {
        return currentPath[key];
      }, context)
    }

    if (filterFunc && filterFunc(fromValue)) {
      return context.result.accepted()
    } else if (Boolean(fromValue)) {
      return context.result.accepted()
    }

    return context.result.discarded()
  }

  return filterInput
}

module.exports = filterInputFactory;
