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
  var signal = [
    function (args) {

      args.state.set('foo', 'value');
      args.state.set(['foo'], 'value');

    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test.sync();
  test.done()
};
