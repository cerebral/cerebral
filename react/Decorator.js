var Hoc = require('./HOC.js')

module.exports = function (paths) {
  return function (Component) {
    return Hoc(Component, paths)
  }
}
