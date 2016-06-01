var ServerController = require('./../src/index.js').ServerController
var suite = {}

suite['should get top level key'] = function (test) {
  var ctrl = ServerController({foo: 'bar'})
  test.equal(ctrl.get('foo'), 'bar')
  test.done()
}

suite['should get nested key'] = function (test) {
  var ctrl = ServerController({foo: {some: 'bar'}})
  test.equal(ctrl.get('foo.some'), 'bar')
  test.done()
}

module.exports = { accessors: suite }
