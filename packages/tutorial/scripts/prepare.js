/* global rm, ls, cp, sed */
var path = require('path')
var paths = require('./paths')

function prepare (part) {
  var hasSrc = ls(paths.root).reduce(function (currentHasSrc, file) {
    if (file === 'src') {
      return true
    }

    return currentHasSrc
  }, false)

  if (hasSrc) {
    ls(paths.src).forEach(function (file) {
      if (file !== 'index.js') {
        rm('-rf', path.join(paths.src, file))
      }
    })
  }

  ls(path.join(paths.parts, part, 'src')).forEach(function (file) {
    cp('-R', path.join(paths.parts, part, 'src', file), paths.src)
  })
  cp(paths.partsIndex, paths.public)
  sed('-i', '%N%', part, paths.publicIndex)
}

module.exports = prepare
