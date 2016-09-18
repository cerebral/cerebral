export function ensurePath(path) {
  if (Array.isArray(path)) {
    return path
  } else if (typeof path === 'string') {
    return path.split('.')
  }

  return []
}

export function throwError(message) {
  throw new Error(`Cerebral - ${message}`)
}

export function isDeveloping() {
  return process.env.NODE_ENV !== 'production'
}

export function isDebuggerEnv() {
  return !(
    (
      typeof window === 'undefined'
    ) ||
    (
      typeof window.chrome === 'undefined' &&
      !process && !process.versions && !process.versions.electron
    )
  );
}
