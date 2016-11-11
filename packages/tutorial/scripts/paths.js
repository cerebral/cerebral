var path = require('path')

function resolve (...paths) {
  return path.resolve(__dirname, ...paths)
}

module.exports = {
  package: resolve('../package.json'),
  root: resolve('..'),
  src: resolve('../src'),
  dist: resolve('../dist'),
  parts: resolve('../parts/'),
  partsIndex: resolve('../parts/index.html'),
  public: resolve('../public/'),
  publicIndex: resolve('../public/index.html'),
  build: resolve('../build/')
}
