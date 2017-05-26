let hiddenKey
let visibilityChange

if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hiddenKey = 'hidden'
  visibilityChange = 'visibilitychange'
} else if (typeof document.msHidden !== 'undefined') {
  hiddenKey = 'msHidden'
  visibilityChange = 'msvisibilitychange'
} else if (typeof document.webkitHidden !== 'undefined') {
  hiddenKey = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}

const signals = []
export const unregister = signal => {
  const idx = signals.indexOf(signal)
  if (idx >= 0) {
    signals.splice(idx, 1)
  }
}

export const register = signal => {
  unregister(signal)
  signals.push(signal)
}

const handleVisibilityChange = () => {
  const hidden = document[hiddenKey]
  signals.forEach(signal => signal({ visible: !hidden }))
}

document.addEventListener(visibilityChange, handleVisibilityChange, false)
