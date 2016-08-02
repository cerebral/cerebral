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

function cleanPath (path) {
  if (Array.isArray(path)) {
    path = path.join('.')
  }

  return path.replace(/\.\*\*|\.\*/, '')
}

function traverseDepsMap (deps, cacheKey) {
  Object.keys(deps).forEach(function (key) {
    var depsKey = deps[key].getDepsMap ? deps[key] : cleanPath(deps[key])
    if (depsKey.getDepsMap) {
      traverseDepsMap(depsKey.getDepsMap(), cacheKey)
    } else if (!Computed.registry[depsKey]) {
      Computed.registry[depsKey] = [cacheKey]
    } else if (Computed.registry[depsKey].indexOf(cacheKey) === -1) {
      Computed.registry[depsKey] = Computed.registry[depsKey].concat(cacheKey)
    }
  })
}

function Computed (paths, cb) {
  return function (props) {
    var deps = typeof paths === 'function' ? paths(props) : paths
    var cacheKey = JSON.stringify(deps) + (props ? JSON.stringify(props) : '') + cb.toString().replace(/\s/g, '')
    traverseDepsMap(deps, cacheKey)

    return {
      getDepsMap: function () {
        return deps
      },
      get: function (passedState, force) {
        if (!force && Computed.cache[cacheKey]) {
          return Computed.cache[cacheKey]
        }

        var depsProps = Object.keys(deps).reduce(function (props, key) {
          if (typeof deps[key] === 'string' || Array.isArray(deps[key])) {
            var path = cleanPath(deps[key])
            props[key] = getByPath(path.split('.'), passedState)
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
