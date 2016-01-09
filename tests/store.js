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
  var signal = [
    function () {}
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test();
  ctrl.getSignals().test();
  async(function () {
    test.equals(ctrl.getStore().getSignals().length, 2);
    test.done();
  });
};

exports['should store details about signal'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  var signal = [
    function ActionA () {}
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test({
    foo: true
  });
  async(function () {
    var signal = ctrl.getStore().getSignals()[0];
    test.equal(signal.name, 'test');
    test.deepEqual(signal.input, {foo: true});
    test.equal(signal.branches.length, 1);
    test.done();
  });
};

exports['should not store default args'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  var signal = [
    function ActionA () {}
  ];

  ctrl.services({
    utils: 'test'
  });
  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test({
    foo: true
  });
  async(function () {
    var signal = ctrl.getStore().getSignals()[0];
    test.equal(signal.name, 'test');
    test.deepEqual(signal.input, {foo: true});
    test.equal(signal.branches.length, 1);
    test.done();
  });
};

exports['should store details about actions'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  var signal = [
    function ActionA () {}
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test({
    foo: true
  });
  async(function () {
    var action = ctrl.getStore().getSignals()[0].branches[0];
    test.equal(action.name, 'ActionA');
    test.equal(action.mutations.length, 0);
    test.done();
  });
};

exports['should store details about mutations'] = function (test) {
  var state = {};
  var ctrl = Controller(Model());
  var signal = [
    function ActionA (args) {
      args.state.set('foo', 'bar');
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test();

  async(function () {

    var action = ctrl.getStore().getSignals()[0].branches[0];
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
  var signalSync = [
    function ActionA (args) {
      args.state.set('foo', 'bar');
    }
  ];

  ctrl.signals({
    'test': signalSync
  });
  var signalAsync = [
    [function ActionB (args) {
      args.output();
    }], function ActionC (args) {
      args.state.set('foo', 'bar');

      async(function () {
        var actionAsync = ctrl.getStore().getSignals()[0].branches[1];
        test.deepEqual(actionAsync.mutations[0], {
          name: 'set',
          path: ['foo'],
          args: ['bar']
        });
        var action = ctrl.getStore().getSignals()[1].branches[0];
        test.deepEqual(action.mutations[0], {
          name: 'set',
          path: ['foo'],
          args: ['bar']
        });
        test.done();
      });

    }
  ];
  ctrl.signals({
    'testAsync': signalAsync
  });
  ctrl.getSignals().testAsync();
  ctrl.getSignals().test();
};

exports['should indicate async actions'] = function (test) {
  var ctrl = Controller(Model());
  var signal = [
    [function ActionA (args) {
      args.output();
    }], function () {
      async(function () {
        test.ok(ctrl.getStore().getSignals()[0].branches[0][0].isAsync);
        test.done();
      });
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test();
};

exports['should indicate when async actions are running'] = function (test) {
  var ctrl = Controller(Model());
  var signal = [
    [function (args) {
      test.ok(ctrl.getStore().isExecutingAsync());
      args.output();
    }]
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.on('signalEnd', function () {
    test.ok(!ctrl.getStore().isExecutingAsync());
    test.done();
  });
  ctrl.getSignals().test();

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
          },
          merge: function (path, value) {
            state = {};
          }
        }
      };

    };
  };
  var ctrl = Controller(Model());
  var signal = [
    function (args) {
      args.state.set('foo', args.input.foo);
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test({
    foo: 'bar'
  });
  ctrl.getSignals().test({
    foo: 'bar2'
  });
  async(function () {
    ctrl.getStore().remember(0);
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
          controller.getStore().remember(0);
          test.deepEqual(state, {foo: 'bar'});
          test.done();
        }
      });
      return {
        mutators: {
          set: function (path, value) {
            state = {};
            state[path.pop()] = value;
          },
          merge: function (path, value) {
            state = {};
          }
        }
      }
    };
  };
  var ctrl = Controller(Model());
  var signal = [
    [function ActionA (args) {
      args.output({
        result: args.input.foo
      });
    }], function ActionB (args) {
      args.state.set('foo', args.input.result);
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getSignals().test({
    foo: 'bar'
  });
  ctrl.getSignals().test({
    foo: 'bar2'
  });
};
