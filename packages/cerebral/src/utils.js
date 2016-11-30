export function propsDiffer (propsA, propsB) {
  const propsAKeys = Object.keys(propsA)
  const propsBKeys = Object.keys(propsB)
  let isDifferent = false

  if (propsAKeys.length !== propsBKeys.length) {
    isDifferent = true
  } else {
    for (let i = 0; i < propsBKeys.length; i++) {
      if (propsA[propsBKeys[i]] !== propsB[propsBKeys[i]]) {
        isDifferent = true
        break
      }
    }
  }

  return isDifferent
}

export function cleanPath (path) {
  return path.replace(/\.\*\*|\.\*/, '')
}

export function isObject (obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
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
        throwError(`You are in strict mode and path "${path}" is being replaced by "${currentPathKey.join('.')}". Change "${path}" to "${currentPathKey.join('.')}" or do not replace the path`)
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

export const noop = () => {}

export const forceSerializable = (value) => {
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
