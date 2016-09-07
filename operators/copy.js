function copyOperator(fromPath, toPath) {
  function copy(context) {
    var fromPathArray = fromPath.split('.')
    var toPathArray = toPath.split('.')
    var fromTarget
    var toTarget
    var fromValue

    if (typeof context[fromPathArray[0]].get === 'function') {
      fromTarget = fromPathArray.shift()
      fromValue = context[fromTarget].get(fromPathArray)
    } else {
      fromValue = fromPathArray.reduce(function (currentPath, key) {
        return currentPath[key];
      }, context)
    }

    if (typeof context[toPathArray[0]].set === 'function') {
      toTarget = toPathArray.shift()
      context[toTarget].set(toPathArray, fromValue)
    } else {
      toTarget = toPathArray.pop()
      var targetObject = pathArray.reduce(function (currentPath, key) {
        return currentPath[key];
      }, context)
      targetObject[toTarget] = fromValue
    }

    context.debugger && context.debugger.send({
      method: 'copy',
      color: 'red',
      args: [fromPath, toPath]
    })
  }

  return copy
}

module.exports = copyOperator
