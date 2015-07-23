var Lib = require('./../src/index.js');
var async = function (cb) {
  setTimeout(cb, 0);
};

exports['should create a signal'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test');
  test.ok(typeof ctrl.signals.test === 'function');
  test.done();
};

exports['should trigger an action when run'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', function () {
    test.ok(true);
    test.done();
  });
  ctrl.signals.test();

};

exports['should pass initial payload on first argument'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', function (args) {
    test.deepEqual(args, {foo: 'bar'});
    test.done();
  });
  ctrl.signals.test({foo: 'bar'});
};

exports['should be able to set new args'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', function () {
    return {
      result: true
    };
  }, function (args) {
    test.ok(args.result);
    test.done();
  });
  ctrl.signals.test();
};

exports['should be able to resolve as an async action'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function (args, state, promise) {
    async(function () {
      promise.resolve({
        result: true
      });
    });
  }], function (args) {
    test.ok(args.result);
    test.done();
  });
  ctrl.signals.test();
};

exports['should be able to resolve async to a resolved result path'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function (args, state, promise) {
    promise.resolve({result: true});
  }, {
    'resolve': [function (args) {
      test.ok(args.result);
      test.done();
    }]
  }]);
  ctrl.signals.test();
};

exports['should be able to resolve async to a rejected result path'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function (args, state, promise) {
    promise.reject({result: true});
  }, {
    'reject': [function (args) {
      test.ok(args.result);
      test.done();
    }]
  }]);
  ctrl.signals.test();
};

exports['should expose mutation and a get method, if passed'] = function (test) {
  var ctrl = Lib.Controller({
    onGet: function () {},
    onSet: function () {},
    onMerge: function () {},
    onUnset: function () {},
    onPush: function () {},
    onPop: function () {},
    onSplice: function () {},
    onConcat: function () {},
    onShift: function () {},
    onUnshift: function () {}
  });
  ctrl.signal('test', function (args, state) {
    test.ok(typeof state.get === 'function');
    test.ok(typeof state.set === 'function');
    test.ok(typeof state.merge === 'function');
    test.ok(typeof state.unset === 'function');
    test.ok(typeof state.push === 'function');
    test.ok(typeof state.pop === 'function');
    test.ok(typeof state.splice === 'function');
    test.ok(typeof state.concat === 'function');
    test.ok(typeof state.shift === 'function');
    test.ok(typeof state.unshift === 'function');
    test.done();
  });
  ctrl.signals.test();
};

exports['should handle arrays of actions to run in parallell'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function (args, state, promise) {
    promise.resolve({
      foo: true
    });
  }, function (args, state, promise) {
    promise.resolve({
      bar: true
    });
  }], function (args) {
    test.deepEqual(args, {foo: true, bar: true});
    test.done();
  });
  ctrl.signals.test();
};

exports['should only have access to the get method when async action'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function (args, state) {
    test.deepEqual(Object.keys(state), ['get']);
    test.done();
  }]);
  ctrl.signals.test();
};

exports['should allow for default args'] = function (test) {
  var ctrl = Lib.Controller({
    defaultArgs: {
      foo: 'bar'
    }
  });
  ctrl.signal('test', function (args, state) {
    test.deepEqual(args, {foo: 'bar'});
    test.done();
  });
  ctrl.signals.test();
};

exports['should trigger signal synchronously when passing true as first argument'] = function (test) {
  var ctrl = Lib.Controller();
  var hasRun = false;
  ctrl.signal('test', function () {
    hasRun = true;
  });
  ctrl.signals.test(true);
  test.ok(hasRun);
  test.done();
};
