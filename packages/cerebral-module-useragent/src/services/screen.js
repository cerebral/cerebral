export function getSpecs () {
  return {
    orientation: getOrientation(),
    size: getSize()
  }
}

export function getOrientation () {
  if (window.innerHeight < window.innerWidth) {
    return 'landscape'
  }

  if (window.innerHeight > window.innerWidth) {
    return 'portrait'
  }

  return 'square'
}

export function getSize () {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  }
}

export default {
  getSpecs,
  getOrientation,
  getSize
}
