import Tag from './tags/Tag'
import {Compute} from './Compute'

export function getChangedProps (propsA, propsB) {
  const propsAKeys = Object.keys(propsA)
  const propsBKeys = Object.keys(propsB)
  const changedProps = {}

  for (let i = 0; i < propsAKeys.length; i++) {
    if (propsA[propsAKeys[i]] !== propsB[propsAKeys[i]]) {
      changedProps[propsAKeys[i]] = true
    }
  }

  for (let i = 0; i < propsBKeys.length; i++) {
    if (propsA[propsBKeys[i]] !== propsB[propsBKeys[i]]) {
      changedProps[propsBKeys[i]] = true
    }
  }

  return Object.keys(changedProps).length ? changedProps : null
}

export function cleanPath (path) {
  return typeof path === 'string' ? path.replace(/\.\*\*|\.\*/, '') : path
}

export function isObject (obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function isComplexObject (obj) {
  return typeof obj === 'object' && obj !== null
}

export function isSerializable (value, additionalTypes = []) {
  const validType = additionalTypes.reduce((currentValid, type) => {
    if (currentValid || value instanceof type) {
      return true
    }

    return currentValid
  }, false)

  if (
    value !== undefined &&
    (
      validType ||
      (
        isObject(value) &&
        Object.prototype.toString.call(value) === '[object Object]' &&
        value.constructor === Object
      ) ||
      typeof value === 'number' ||
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      value === null ||
      Array.isArray(value)
    )
  ) {
    return true
  }
  return false
}

export function ensurePath (path = []) {
  if (Array.isArray(path)) {
    return path
  } else if (typeof path === 'string') {
    return path.split('.')
  }

  return []
}

export function throwError (message) {
  throw new Error(`Cerebral - ${message}`)
}

export function isDeveloping () {
  return process.env.NODE_ENV !== 'production'
}

export function isDebuggerEnv () {
  return !(
    (
      typeof window === 'undefined'
    ) ||
    (
      typeof window.chrome === 'undefined' &&
      !process && !process.versions && !process.versions.electron
    )
  )
}

export function verifyStrictRender (changes, dependencyMap) {
  let currentPathKey = []
  for (let path in dependencyMap) {
    const pathArray = cleanPath(path).split('.')
    let currentChangeKey = pathArray.shift()
    let currentChangePath = changes
    currentPathKey.push(currentChangeKey)
    while (currentChangePath) {
      if (currentChangePath[currentChangeKey] === true && pathArray.length !== 0) {
        throwError(`Render warning! The path "${path}" is being replaced by "${currentPathKey.join('.')}". Change "${path}" to "${currentPathKey.join('.')}" or do not replace the path`)
      }
      currentPathKey.push(currentChangeKey)
      currentChangePath = currentChangePath[pathArray.shift()]
    }
    currentPathKey.length = 0
  }
}

export function debounce (func, wait) {
  let timeout

  return function (...args) {
    const context = this
    const later = () => {
      timeout = null
      func.apply(context, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function forceSerializable (value) {
  if (value && !isSerializable(value)) {
    const name = value.constructor.name

    try {
      Object.defineProperty(value, 'toJSON', {
        value () {
          return `[${name}]`
        }
      })
    } catch (e) {}
  }

  return value
}

export function getProviders (module) {
  return (module.provider ? [module.provider] : []).concat(Object.keys(module.modules || {})
    .reduce((nestedProviders, moduleKey) => {
      return nestedProviders.concat(getProviders(module.modules[moduleKey]))
    }, [])
  )
}

export function dependencyMatch (changes, dependencyMap, currentKey = '') {
  let currentMatches = []

  for (const key in changes) {
    const pathKey = currentKey ? currentKey + '.' + key : key

    let matches = []
    if (changes[key] === true) {
      if (dependencyMap[pathKey]) {
        matches = matches.concat(dependencyMap[pathKey])
      }
      if (dependencyMap[pathKey + '.*']) {
        matches = matches.concat(dependencyMap[pathKey + '.*'])
      }
      if (dependencyMap[pathKey + '.**']) {
        matches = matches.concat(dependencyMap[pathKey + '.**'])
      }
    } else {
      if (dependencyMap[pathKey + '.*']) {
        const immediateKeys = Object.keys(changes[key])
        for (let z = 0; z < immediateKeys.length; z++) {
          if (changes[key][immediateKeys[z]] === true) {
            matches = matches.concat(dependencyMap[pathKey + '.*'])
            break
          }
        }
      }
      if (dependencyMap[pathKey + '.**']) {
        matches = matches.concat(dependencyMap[pathKey + '.**'])
      }
    }

    for (let y = 0; y < matches.length; y++) {
      if (currentMatches.indexOf(matches[y]) === -1) {
        currentMatches.push(matches[y])
      }
    }

    if (changes[key] !== true) {
      currentMatches = currentMatches.concat(dependencyMatch(changes[key], dependencyMap, pathKey))
    }
  }

  return currentMatches
}

export function getWithPath (obj) {
  return (path) => {
    return path.split('.').reduce((currentValue, key, index) => {
      if (index > 0 && currentValue === undefined) {
        throwError(`You are extracting with path "${path}", but it is not valid for this object`)
      }

      return currentValue[key]
    }, obj)
  }
}

export function ensureStrictPath (path, value) {
  if (isObject(value) && path.indexOf('*') === -1) {
    return `${path}.**`
  }

  return path
}

export function createResolver (getters) {
  return {
    isTag (arg, ...types) {
      if (!(arg instanceof Tag)) {
        return false
      }

      if (types.length) {
        return types.reduce((isType, type) => {
          return isType || type === arg.type
        }, false)
      }

      return true
    },
    value (arg) {
      if (arg instanceof Tag || arg instanceof Compute) {
        return arg.getValue(getters)
      }

      return arg
    },
    path (arg) {
      if (arg instanceof Tag) {
        return arg.getPath({
          state: getters.state.get,
          input: getters.input
        })
      }

      throwError('You are extracting a path from an argument that is not a Tag')
    }
  }
}

export const noop = () => {}
