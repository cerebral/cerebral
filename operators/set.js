function setOperator(path, value) {
  function set(context) {
    var pathArray = path.split('.')
    var target

    if (typeof context[pathArray[0]].set === 'function') {
      target = pathArray.shift()
      context[target].set(pathArray, value)
      context.debugger && context.debugger.send({
        method: target + '.set',
        color: 'red',
        args: [pathArray, value]
      })
    } else {
      target = pathArray.pop()
      var targetObject = pathArray.reduce(function (currentPath, key) {
        return currentPath[key];
      }, context)
      targetObject[target] = value
      context.debugger && context.debugger.send({
        method: 'set',
        color: 'red',
        args: [path, value]
      })
    }
  }
}

module.exports = setOperator
