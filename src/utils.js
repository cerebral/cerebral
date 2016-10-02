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

export function isSerializable (value) {
  if (
    (
      isObject(value) &&
      Object.prototype.toString.call(value) === '[object Object]' &&
      value.constructor === Object
    ) ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    Array.isArray(value)
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
