/* global rm, mkdir, ls, cp, sed */
var path = require('path')
var paths = require('./paths')

function prepare (part) {
  var hasSrc = ls(paths.root).reduce(function (currentHasSrc, file) {
    if (file === 'src') {
      return true
    }

    return currentHasSrc
  }, false)

  if (!hasSrc) {
    mkdir(paths.src)
  }

  cp('-R', path.join(paths.parts, part, 'src', '*'), paths.src)
  cp(paths.partsIndex, paths.public)
  sed('-i', '%N%', part, paths.publicIndex)
}

module.exports = prepare
