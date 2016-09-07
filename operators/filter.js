function filterFactory(path, filterFunc) {
  function filter(context) {
    var pathArray = path.split('.')
    var fromValue

    if (typeof context[pathArray[0]].get === 'function') {
      var fromTarget = pathArray.shift()

      fromValue = context[fromTarget].get(path)
    } else {
      fromValue = pathArray.reduce(function (currentPath, key) {
        return currentPath[key];
      }, context)
    }

    if (filterFunc && filterFunc(fromValue)) {
      return context.path.accepted()
    } else if (Boolean(fromValue)) {
      return context.path.accepted()
    }
    return context.path.discarded()
  }

  return filter
}

module.exports = filterFactory;
