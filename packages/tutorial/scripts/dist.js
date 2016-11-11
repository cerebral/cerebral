/* global sed, ls, exec, cp, rm, mkdir, test */
var prepare = require('./prepare')
var path = require('path')
var paths = require('./paths')

function clean () {
  sed('-i', /\/tutorial\/.*"/g, '/tutorial"', paths.package)
}

function makeDist () {
  rm('-rf', paths.dist)
  mkdir('-p', paths.dist)
  ls('-d', paths.parts + '/*').forEach(function (dir) {
    if (test('-d', dir)) {
      var part = dir.split('/').slice(-1)[0]
      prepare(part)
      sed('-i', /\/tutorial\/?.*"/g, '/tutorial/' + part + '"', paths.package)
      exec('npm run build')
      cp('-R', paths.build, path.join(paths.dist, part))
    }
  })
  clean()
}

makeDist()
