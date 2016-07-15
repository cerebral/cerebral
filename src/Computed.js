function getByPath (path, state) {
  var currentPath = state
  for (var x = 0; x < path.length; x++) {
    var key = path[x]
    if (currentPath[key] === undefined) {
      return currentPath[key]
    }
    currentPath = currentPath[key]
  }
  return currentPath
}

function Computed (paths, cb) {
  return function (props) {
    var deps = typeof paths === 'function' ? paths(props) : paths
    var cacheKey = JSON.stringify(deps) + (props ? JSON.stringify(props) : '') + cb.toString().replace(/\s/g, '')
    Object.keys(deps).forEach(function (key) {
      if (!Computed.registry[deps[key]]) {
        Computed.registry[deps[key]] = [cacheKey]
      } else if (Computed.registry[deps[key]].indexOf(cacheKey) === -1) {
        Computed.registry[deps[key]] = Computed.registry[deps[key]].concat(cacheKey)
      }
    })
    return {
      getDepsMap: function () {
        return deps
      },
      get: function (passedState) {
        if (Computed.cache[cacheKey]) {
          return Computed.cache[cacheKey]
        }

        var depsProps = Object.keys(deps).reduce(function (props, key) {
          if (typeof deps[key] === 'string' || Array.isArray(deps[key])) {
            var path = typeof deps[key] === 'string' ? deps[key].split('.') : deps[key].slice()
            props[key] = getByPath(path, passedState)
          } else {
            props[key] = deps[key].get(passedState)
          }
          return props
        }, {})
        var passedProps = props || {}
        var allProps = Object.keys(passedProps).reduce(function (depsProps, key) {
          depsProps[key] = passedProps[key]
          return depsProps
        }, depsProps)
        var value = cb(allProps)
        Computed.cache[cacheKey] = value
        return value
      }
    }
  }
}

Computed.cache = {}
Computed.registry = {}
Computed.updateCache = function (changes) {
  var computedMap = Computed.registry
  function traverse (level, currentPath, computedToFlag) {
    Object.keys(level).forEach(function (key) {
      currentPath.push(key)
      var stringPath = currentPath.join('.')
      if (computedMap[stringPath]) {
        computedToFlag = computedMap[stringPath].reduce(function (computedToFlag, computed) {
          if (computedToFlag.indexOf(computed) === -1) {
            return computedToFlag.concat(computed)
          }
          return computedToFlag
        }, computedToFlag)
      }
      if (level[key] !== true) {
        computedToFlag = traverse(level[key], currentPath, computedToFlag)
      }
      currentPath.pop()
    })
    return computedToFlag
  }
  var computedToFlag = traverse(changes, [], [])
  computedToFlag.forEach(function (computed) {
    delete Computed.cache[computed]
  })
}

if (process.env.NODE_ENV === 'test') {
  var testComputed = function Computed (paths, cb) { return cb }
  testComputed.updateCache = Computed.updateCache
  module.exports = testComputed
} else {
  module.exports = Computed
}
