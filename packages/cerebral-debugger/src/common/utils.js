export function hashCode (str) { // java String#hashCode
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

export function intToRGB (i) {
  var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase()

  return '00000'.substring(0, 6 - c.length) + c
}

export function hexToRgb (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function checkLuminance (c) {
  c = c.substring(1)      // strip #
  var rgb = parseInt(c, 16)   // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff  // extract red
  var g = (rgb >> 8) & 0xff  // extract green
  var b = (rgb >> 0) & 0xff  // extract blue

  return 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
}

export function ColorLuminance (hex, lum) {
	// validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '')
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  lum = lum || 0

	// convert to decimal and change luminosity
  var rgb = '#', c, i
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16)
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
    rgb += ('00' + c).substr(c.length)
  }

  return rgb
}

import Color from 'color'

const FNV1_32A_INIT = 0x811c9dc5
function fnv32aHash (str) {
  let hval = FNV1_32A_INIT
  for (var i = 0; i < str.length; ++i) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }
  return hval >>> 0
}

export function nameToColors (moduleName, signalName, maxDarken = -0.4, maxLighten = 0.8) {
  const colors = [
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
    '#2196F3', // Blue
    '#03A9F4', // Light Blue
    '#00BCD4', // Cyan
    '#009688', // Teal
    '#4CAF50', // Green
    '#8BC34A', // Light Green
    '#CDDC39', // Lime
    '#FFEB3B', // Yellow
    '#FFC107', // Amber
    '#FF9800', // Orange
    '#FF5722', // Deep Orange
    '#795548', // Brown
    '#607D8B' // Blue Grey
  ]

  const hashedModuleName = Math.abs(fnv32aHash(moduleName))
  const baseColorIndex = hashedModuleName % colors.length
  const baseColor = Color(colors[baseColorIndex])

  const hashedSignalName = Math.abs(fnv32aHash(signalName))
  const lightenByNormalized = hashedSignalName / Math.pow(2, 32)
  const interpolatedLighten = maxDarken + lightenByNormalized * (maxLighten - maxDarken)
  const interpolatedColor = baseColor.lighten(interpolatedLighten)
  const backgroundColor = interpolatedColor.hexString()

  const color = interpolatedColor.dark() ? 'white' : 'black'
  return {backgroundColor, color}
}

export function isObject (obj) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
}

export function isArray (array) {
  return Array.isArray(array)
}

export function isBoolean (bool) {
  return typeof bool === 'boolean'
}

export function isString (string) {
  return typeof string === 'string'
}

export function isNumber (number) {
  return typeof number === 'number'
}

export function isNull (_null) {
  return _null === null
}
