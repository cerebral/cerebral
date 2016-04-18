var types = require('./types.js')

module.exports = {
  getFunctionName: function (fun) {
    var ret = fun.toString()
    ret = ret.substr('function '.length)
    ret = ret.substr(0, ret.indexOf('('))
    return ret
  },
  merge: function () {
    var args = [].slice.call(arguments)
    var target = args.shift()
    return args.reduce(function (target, source) {
      return Object.keys(source || {}).reduce(function (target, key) {
        target[key] = source[key]
        return target
      }, target)
    }, target)
  },
  hasLocalStorage: function () {
    return typeof global.localStorage !== 'undefined'
  },
  isPathObject: function (obj) {
    return (
    obj && (obj.resolve || obj.reject)
    )
  },
  debounce: function debounce (func, wait, immediate) {
    var timeout
    return function () {
      var context = this
      var args = arguments
      var later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  },
  isAction: function (action) {
    return typeof action === 'function'
  },
  isDeveloping: function () {
    return typeof process === 'undefined' || process.env.NODE_ENV !== 'production'
  },
  verifyInput: function (actionName, signalName, input, signalArgs) {
    Object.keys(input).forEach(function (key) {
      if (typeof signalArgs[key] === 'undefined' || !types(input[key], signalArgs[key])) {
        throw new Error([
          'Cerebral: You are giving the wrong input to the action "' +
          actionName + '" ' +
          'in signal "' + signalName + '". Check the following prop: "' + key + '"'
        ].join(''))
      }
    })
  },
  extractMatchingPathFunctions: function (source, target) {
    var incompatible = false
    var traverse = function (obj, currentTarget, path, results) {
      if (incompatible) {
        return incompatible
      }

      if (typeof obj === 'function') {
        results[path.join('.')] = obj
      } else if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
        for (var key in obj) {
          if (!(key in currentTarget)) {
            incompatible = path.slice().concat(key)
            return incompatible
          } else {
            path.push(key)
            traverse(obj[key], currentTarget[key], path, results)
            path.pop(key)
          }
        }
      }
      return incompatible || results
    }

    return traverse(source, target, [], {})
  },
  setDeep: function (object, stringPath, value) {
    var path = stringPath.split('.')
    var setKey = path.pop()
    while (path.length) {
      var key = path.shift()
      object = object[key] = object[key] || {}
    }
    object[setKey] = object[setKey] ? Object.keys(object[setKey]).reduce(function (value, key) {
      value[key] = object[setKey][key]
      return value
    }, value) : value
    return value
  },
  extractExternalContextProviders: function (providers, modulePath) {
    var extractedProviders = providers.__cerebral_global__
    if (modulePath && providers[modulePath.join('.')]) {
      return extractedProviders.concat(providers[modulePath.join('.')])
    }

    return extractedProviders
  }
}
