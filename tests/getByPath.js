var getByPath = require('../src/getByPath')
var suite = {}

suite['should be able to get by path using array'] = function (test) {
  var obj = {foo: { bar: 'bar' }}
  var result = getByPath(obj, ['foo', 'bar'])
  test.equals(result, 'bar')
  test.done()
}

suite['should be able to get by path using dot notation'] = function (test) {
  var obj = {foo: { bar: 'bar' }}
  var result = getByPath(obj, 'foo.bar')
  test.equals(result, 'bar')
  test.done()
}

suite['should return undefined when pointing to invalid path'] = function (test) {
  var obj = {foo: { bar: 'bar' }}
  var result = getByPath(obj, 'foo.woop')
  test.equals(result, undefined)
  test.done()
}

suite['should throw errors on invalid data'] = function (test) {
  test.throws(function () {
    getByPath(null, 'foo')
  })
  test.throws(function () {
    getByPath({}, null)
  })
  test.done()
}

module.exports = { getByPath: suite }
