var Controller = require('./../src/index.js');

exports['should give correct path and value to mutation methods'] = function (test) {
  var Model = function (state) {
    return function (controller) {

      return {
        mutators: {
          set: function (path, value) {
            test.deepEqual(path, ['foo']);
            test.deepEqual(value, 'value');
          }
        }
      };

    };
  };
  var ctrl = Controller(Model({}));
  ctrl.signal('test', function (input, state) {

    state.set('foo', 'value');
    state.set(['foo'], 'value');

  });
  ctrl.signals.test(true);
  test.done()
};
