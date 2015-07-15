var Lib = require('./../src/index.js');
var async = function (cb) {
  setTimeout(cb, 0);
};

exports['should only store latest signal by default'] = function (test) {
  var state = {};
  var ctrl = Lib.Controller();
  ctrl.signal('test', function () {});
  ctrl.signals.test();
  ctrl.signals.test();
  async(function () {
    test.equals(ctrl.store.getSignals().length, 1);
    test.done();
  });
};

exports['should store details about signal'] = function (test) {
  var state = {};
  var ctrl = Lib.Controller();
  ctrl.signal('test', function ActionA () {});
  ctrl.signals.test(true);
  async(function () {
    var signal = ctrl.store.getSignals()[0];
    test.equal(signal.name, 'test');
    test.equal(signal.duration, 0);
    test.equal(signal.payload, true);
    test.equal(signal.index, 0);
    test.equal(signal.actions.length, 1);
    test.done();
  });
};

exports['should store details about actions'] = function (test) {
  var state = {};
  var ctrl = Lib.Controller();
  ctrl.signal('test', function ActionA () {});
  ctrl.signals.test(true);
  async(function () {
    var action = ctrl.store.getSignals()[0].actions[0];
    test.equal(action.name, 'ActionA');
    test.equal(action.duration, 0);
    test.equal(action.mutations.length, 0);
    test.done();
  });
};

exports['should store details about mutations'] = function (test) {
  var state = {};
  var ctrl = Lib.Controller();
  ctrl.signal('test', function ActionA (args, state) {
    state.set('foo', 'bar');
  });
  ctrl.signals.test();

  async(function () {

    var action = ctrl.store.getSignals()[0].actions[0];
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
  var ctrl = Lib.Controller();
  ctrl.store.toggleKeepState();
  ctrl.signal('test', function ActionA (args, state) {
    state.set('foo', 'bar');
  });
  ctrl.signal('testAsync', [function ActionB (args, state, promise) {
    promise.resolve({});
  }], function ActionC (args, state) {
    state.set('foo', 'bar');

    async(function () {
      var actionAsync = ctrl.store.getSignals()[0].actions[1];
      test.deepEqual(actionAsync.mutations[0], {
        name: 'set',
        path: ['foo'],
        args: ['bar']
      });
      var action = ctrl.store.getSignals()[1].actions[0];
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
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function ActionA (args, state, promise) {
    promise.resolve({});
  }], function () {
    async(function () {
      test.ok(ctrl.store.getSignals()[0].actions[0].isAsync);
      test.done();
    });
  });
  ctrl.signals.test();
};

exports['should indicate when async actions are running'] = function (test) {
  var count = 0;
  var ctrl = Lib.Controller({
    onStoreChange: function () {
      count++;
    }
  });
  ctrl.signal('test', [function (args, state, promise) {
    promise.resolve();
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
  var ctrl = Lib.Controller({
    onReset: function () {
      state = initialState;
    },
    onSet: function (key, value) {
      state = {};
      state[key] = value;
    }
  });
  ctrl.store.toggleKeepState();
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
  var ctrl = Lib.Controller({
    onReset: function () {
      state = initialState;
    },
    onSet: function (key, value) {
      state = {};
      state[key] = value;
    },
    onUpdate: function () {
      signalCount++;
      if (signalCount === 3) {
        ctrl.store.remember(0);
        test.deepEqual(state, {foo: 'bar'});
        test.done();
      }
    }
  });
  ctrl.store.toggleKeepState();
  ctrl.signal('test', [function ActionA (args, state, promise) {
    promise.resolve({
      result: args.foo
    });
  }], function ActionB (args, state) {
    state.set('foo', args.result);
  });
  ctrl.signals.test({
    foo: 'bar'
  });
  ctrl.signals.test({
    foo: 'bar2'
  });
};
