import raf from 'raf'

export function getSpecs () {
  return {
    orientation: getOrientation(),
    size: getSize()
  }
}

export function getOrientation () {
  const width = getWidth()
  const height = getHeight()

  if (height < width) {
    return 'landscape'
  }

  if (height > width) {
    return 'portrait'
  }

  return 'square'
}

export function getSize () {
  return {
    height: getHeight(),
    width: getWidth()
  }
}

export function getWidth () {
  return window.innerWidth
}

export function getHeight () {
  return window.innerHeight
}

export function onChange (callbackSignal) {
  if (typeof callbackSignal !== 'function') {
    throw new Error('You must pass a signal to onChange')
  }

  let running = false
  window.addEventListener('resize', event => {
    if (running) return
    running = true
    raf(() => {
      callbackSignal()
      running = false
    })
  })
}

export default {
  getSpecs,
  getOrientation,
  getSize,
  getWidth,
  getHeight,
  onChange
}
