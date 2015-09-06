var Controller = require('./../src/index.js');
var async = function (cb) {
  setTimeout(cb, 0);
};
var Model = function () {
  return function () {
    return {
      mutators: {
        set: function (path, value) {
          state = {};
          state[path.pop()] = value;
        }
      }
    }
  };
};

exports['should keep signals by default'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  ctrl.signal('test', function () {});
  ctrl.signals.test();
  ctrl.signals.test();
  async(function () {
    test.equals(ctrl.store.getSignals().length, 2);
    test.done();
  });
};

exports['should store details about signal'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  ctrl.signal('test', function ActionA () {});
  ctrl.signals.test({
    foo: true
  });
  async(function () {
    var signal = ctrl.store.getSignals()[0];
    test.equal(signal.name, 'test');
    test.deepEqual(signal.input, {foo: true});
    test.equal(signal.branches.length, 1);
    test.done();
  });
};

exports['should not store default args'] = function (test) {
  var state = {};
  var ctrl = Controller(Model(), {
    utils: 'test'
  });
  ctrl.signal('test', function ActionA () {});
  ctrl.signals.test({
    foo: true
  });
  async(function () {
    var signal = ctrl.store.getSignals()[0];
    test.equal(signal.name, 'test');
    test.deepEqual(signal.input, {foo: true});
    test.equal(signal.branches.length, 1);
    test.done();
  });
};

exports['should store details about actions'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  ctrl.signal('test', function ActionA () {});
  ctrl.signals.test({
    foo: true
  });
  async(function () {
    var action = ctrl.store.getSignals()[0].branches[0];
    test.equal(action.name, 'ActionA');
    test.equal(action.mutations.length, 0);
    test.done();
  });
};

exports['should store details about mutations'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  ctrl.signal('test', function ActionA (args, state) {
    state.set('foo', 'bar');
  });
  ctrl.signals.test();

  async(function () {

    var action = ctrl.store.getSignals()[0].branches[0];
    test.deepEqual(action.mutations[0], {
      name: 'set',
      path: ['foo'],
      args: ['bar']
    });
    test.done();
  });
};

exports['should store details about mutations correctly across sync and async signals'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  ctrl.signal('test', function ActionA (input, state) {
    state.set('foo', 'bar');
  });
  ctrl.signal('testAsync', [function ActionB (input, state, output) {
    output();
  }], function ActionC (args, state) {
    state.set('foo', 'bar');

    async(function () {
      var actionAsync = ctrl.store.getSignals()[0].branches[1];
      test.deepEqual(actionAsync.mutations[0], {
        name: 'set',
        path: ['foo'],
        args: ['bar']
      });
      var action = ctrl.store.getSignals()[1].branches[0];
      test.deepEqual(action.mutations[0], {
        name: 'set',
        path: ['foo'],
        args: ['bar']
      });
      test.done();
    });

  });
  ctrl.signals.testAsync();
  ctrl.signals.test();
};

exports['should indicate async actions'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', [function ActionA (input, state, output) {
    output();
  }], function () {
    async(function () {
      test.ok(ctrl.store.getSignals()[0].branches[0][0].isAsync);
      test.done();
    });
  });
  ctrl.signals.test();
};

exports['should indicate when async actions are running'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', [function (args, state, next) {
    next();
  }]);
  ctrl.signals.test();
  async(function () {
    test.ok(ctrl.store.isExecutingAsync());
    async(function () {
      test.ok(!ctrl.store.isExecutingAsync());
      test.done();
    });
  });

};


exports['should be able to remember previous signal'] = function (test) {
  var initialState = {};
  var state = initialState;
  var Model = function () {
    return function (controller) {

      controller.on('reset', function () {
        state = initialState;
      });

      return {
        mutators: {
          set: function (path, value) {
            state = {};
            state[path.pop()] = value;
          }
        }
      };

    };
  };
  var ctrl = Controller(Model());
  ctrl.signal('test', function (args, state) {
    state.set('foo', args.foo);
  });
  ctrl.signals.test({
    foo: 'bar'
  });
  ctrl.signals.test({
    foo: 'bar2'
  });
  async(function () {
    ctrl.store.remember(0);
    test.deepEqual(state, {foo: 'bar'});
    test.done();
  });
};

exports['should be able to remember async actions and run them synchronously when remembering'] = function (test) {
  var signalCount = 0;
  var initialState = {};
  var state = initialState;
  var Model = function () {
    return function (controller) {
      controller.on('reset', function () {
        state = initialState;
      });
      controller.on('signalEnd', function () {
        signalCount++;
        if (signalCount === 2) {
          controller.store.remember(0);
          test.deepEqual(state, {foo: 'bar'});
          test.done();
        }
      });
      return {
        mutators: {
          set: function (path, value) {
            state = {};
            state[path.pop()] = value;
          }
        }
      }
    };
  };
  var ctrl = Controller(Model());
  ctrl.signal('test', [function ActionA (input, state, output) {
    output({
      result: input.foo
    });
  }], function ActionB (input, state) {
    state.set('foo', input.result);
  });
  ctrl.signals.test({
    foo: 'bar'
  });
  ctrl.signals.test({
    foo: 'bar2'
  });
};
