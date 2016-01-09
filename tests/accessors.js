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
    function (args) {
      test.ok(args.state.get);
      test.ok(args.state.keys);

    }
  ];

  ctrl.signals({
    'test': signal
  });
  test.expect(2)
  ctrl.getSignals().test.sync();
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
    function (args) {
      args.state.get('foo');
      args.state.get(['foo']);
      args.state.get('foo', 'bar');
    }
  ];

  ctrl.signals({
    'test': signal
  });
  test.expect(3)
  ctrl.getSignals().test.sync();
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
    function (args) {
      args.state.get('foo', 'bar');
    }
  ];

  ctrl.signals({
    'test': signal
  });
  test.expect(2);
  ctrl.getSignals().test.sync();
  test.done()
};

exports['should allow dot notation'] = function (test) {
  var Model = function (state) {
    return function (controller) {

      return {
        accessors: {
          get: function (path) {
            test.deepEqual(path, ['foo', 'bar']);
          }
        }
      };

    };
  };
  var ctrl = Controller(Model({}));
  var signal = [
    function (args) {
      args.state.get(['foo', 'bar']);
      args.state.get('foo.bar');
    }
  ];

  ctrl.signals({
    'test': signal
  });
  test.expect(2);
  ctrl.getSignals().test.sync();
  test.done()
};
