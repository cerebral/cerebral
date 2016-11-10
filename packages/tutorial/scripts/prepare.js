/* global rm, cp, sed */
var path = require('path')
var paths = require('./paths')

function prepare (part) {
  rm('-rf', paths.src)
  cp('-R', path.join(paths.parts, part, 'src'), paths.root)
  cp(paths.partsIndex, paths.public)
  sed('-i', '%N%', part, paths.publicIndex)
}

if (process.argv.length > 2 && process.argv[2].indexOf('prepare.js') >= 0) {
  prepare(process.argv[3] || '01')
}

module.exports = prepare
