module.exports = function (target, path) {
  if (!Array.isArray(path) && typeof path !== 'string') {
    throw new Error('Cerebral getByPath - The path: "' + path + '" is not valid')
  }

  if (!Array.isArray(path)) {
    path = path.split('.')
  }

  if (!(target && typeof target === 'object' && !Array.isArray(target))) {
    throw new Error('Cerebral getByPath - The target is not valid, it has to be an object')
  }

  return path.reduce(function (currentTarget, key) {
    if (!currentTarget) {
      return undefined
    }
    return currentTarget[key]
  }, target)
}
