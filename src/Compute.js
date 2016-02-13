module.exports = function (model) {
  var registered = []
  var computed = []
  var cachedByRef = {}

  var createMapper = function (cb) {
    var initialRun = true
    var currentState = {}
    var currentValue

    var get = function (path) {
      var value
      path = typeof path === 'string' ? path.split('.') : path
      if (typeof path === 'function') {
        if (!has(path)) {
          registered.push(path)
          if (path.computedRef) {
            cachedByRef[path.computedRef] = path
          }
          computed.push(createMapper(path))
        }
        value = currentState['COMPUTED_' + (path.computedRef ? path.computedRef : registered.indexOf(path))] = getComputedValue(path)
      } else {
        value = currentState[path.join('.%.')] = model.accessors.get(path)
      }

      return value
    }

    return function () {
      var hasChanged = Object.keys(currentState).reduce(function (hasChanged, key) {
        if (hasChanged) {
          return true
        }
        if (key.indexOf('COMPUTED') === 0) {
          var index = key.split('_')[1]
          return getComputedValue(registered[index] || cachedByRef[index]) !== currentState[key]
        } else {
          return model.accessors.get(key.split('.%.')) !== currentState[key]
        }
      }, false)

      if (hasChanged || initialRun) {
        currentState = {}
        initialRun = false
        currentValue = cb(get)
      }

      return currentValue
    }
  }

  var has = function (computedFunc) {
    if (computedFunc.computedRef) {
      return !!cachedByRef[computedFunc.computedRef]
    } else {
      return registered.indexOf(computedFunc) !== -1
    }
  }

  var getComputedValue = function (computedFunc) {
    if (!has(computedFunc)) {
      registered.push(computedFunc)
      if (computedFunc.computedRef) {
        cachedByRef[computedFunc.computedRef] = computedFunc
      }
      computed.push(createMapper(computedFunc))
    }

    if (computedFunc.computedRef) {
      return computed[registered.indexOf(cachedByRef[computedFunc.computedRef])]()
    } else {
      return computed[registered.indexOf(computedFunc)]()
    }
  }

  return {
    register: function (computeFunc) {
      registered.push(computeFunc)
      if (computeFunc.computedRef) {
        cachedByRef[computeFunc.computedRef] = computeFunc
      }
      computed.push(createMapper(computeFunc))
      return this.getComputedValue(computeFunc)
    },
    has: has,
    getComputedValue: getComputedValue
  }
}
