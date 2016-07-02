var Controller = require('./../src/index.js')
var suite = {}

suite['should get top level key'] = function (test) {
  var ctrl = Controller.ServerController({foo: 'bar'})
  test.equal(ctrl.get('foo'), 'bar')
  test.done()
}

suite['should get nested key'] = function (test) {
  var ctrl = Controller.ServerController({foo: {some: 'bar'}})
  test.equal(ctrl.get('foo.some'), 'bar')
  test.done()
}

module.exports = { accessors: suite }
