var Controller = require('./../src/index.js');

exports['should call accessor methods added'] = function (test) {
  var Model = function (state) {
    return function (controller) {

      return {
        accessors: {
          get: function () {

          },
          keys: function () {

          }
        }
      };

    };
  };
  var ctrl = Controller(Model({}));
  var signal = [
    function (input, state) {

      test.ok(state.get);
      test.ok(state.keys);

    }
  ];

  ctrl.signal('test', signal);
  test.expect(2)
  ctrl.signals.test.sync();
  test.done()
};

exports['should have a path as first argument'] = function (test) {
  var Model = function (state) {
    return function (controller) {

      return {
        accessors: {
          get: function (path) {
            test.deepEqual(path, ['foo']);
          }
        }
      };

    };
  };
  var ctrl = Controller(Model({}));
  var signal = [
    function (input, state) {
      state.get('foo');
      state.get(['foo']);
      state.get('foo', 'bar');
    }
  ];

  ctrl.signal('test', signal);
  test.expect(3)
  ctrl.signals.test.sync();
  test.done()
};

exports['should receive the rest of the arguments'] = function (test) {
  var Model = function (state) {
    return function (controller) {

      return {
        accessors: {
          get: function (path, arg) {
            test.deepEqual(path, ['foo']);
            test.equal(arg, 'bar');
          }
        }
      };

    };
  };
  var ctrl = Controller(Model({}));
  var signal = [
    function (input, state) {
      state.get('foo', 'bar');
    }
  ];
  
  ctrl.signal('test', signal);
  test.expect(2);
  ctrl.signals.test.sync();
  test.done()
};
