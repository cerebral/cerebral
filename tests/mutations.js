var Lib = require('./../src/index.js');

exports['should give correct path and value to mutation methods'] = function (test) {
  var ctrl = Lib.Controller({
    onSet: function (path, value) {
      test.deepEqual(path, ['foo']);
      test.deepEqual(value, 'value');
    },
    onUnset: function (path, value) {
      test.deepEqual(path, ['foo', 'bar']);
    },
    onPush: function (path, value) {
      test.deepEqual(path, ['foo', 'bar']);
      test.deepEqual(value, 'value');
    },
    onSplice: function (path, from, length, new1, new2) {
      test.deepEqual(path, ['foo', 'bar']);
      test.deepEqual(from, 0);
      test.deepEqual(length, 1);
      test.deepEqual(new1, 'value');
      test.deepEqual(new2, 'value');
    },
    onMerge: function (path, value) {
      test.ok(Array.isArray(path));
      test.deepEqual(value, {foo: 'bar'});
    },
    onConcat: function (path, value) {
      test.deepEqual(path, ['foo', 'bar']);
      test.deepEqual(value, ['foo']);
    },
    onPop: function (path, value) {
      test.deepEqual(path, ['foo', 'bar']);
      test.deepEqual(value, undefined);
    },
    onShift: function (path, value) {
      test.deepEqual(path, ['foo', 'bar']);
      test.deepEqual(value, undefined);
    },
    onUnshift: function (path, value) {
      test.deepEqual(path, ['foo', 'bar']);
      test.deepEqual(value, 'value');
    }
  });
  ctrl.signal('test', function (input, state) {

    state.set('foo', 'value');
    state.set(['foo'], 'value');
    state.push(['foo', 'bar'], 'value');
    state.splice(['foo', 'bar'], 0, 1, 'value', 'value');
    state.concat(['foo', 'bar'], ['foo']);
    state.unshift(['foo', 'bar'], 'value');

    state.pop(['foo', 'bar']);
    state.pop('foo', 'bar');
    state.shift(['foo', 'bar']);
    state.shift('foo', 'bar');
    state.unset('foo', 'bar');
    state.unset(['foo', 'bar']);

    state.merge(['foo', 'bar'], {foo: 'bar'});
    state.merge({foo: 'bar'});

  });
  ctrl.signals.test(true);
  test.done()
};
