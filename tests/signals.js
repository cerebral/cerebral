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

exports['should be able to define custom outputs as arrays'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next.foo({foo: 'bar'});
  };
  action.outputs = ['foo'];
  ctrl.signal('test', action, {
    foo: [function (args) {
      test.deepEqual(args, {foo: 'bar'});
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should be able to define default custom path'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next({foo: 'bar'});
  };
  action.defaultOutput = 'bar';
  action.outputs = ['foo', 'bar'];
  ctrl.signal('test', action, {
    foo: [],
    bar: [function (args) {
      test.deepEqual(args, {foo: 'bar'});
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should throw error if paths are missing'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function MyAction (args, state, next) {
    next({foo: 'bar'});
  };
  action.outputs = ['foo', 'bar'];
  test.throws(function () {
    ctrl.signal('test', action);
  });
  test.done();
};

exports['should throw error if outputs as array does not match paths'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next({foo: 'bar'});
  };
  action.outputs = ['foo', 'bar'];
  test.throws(function () {
    ctrl.signal('test', action, {
      bar: []
    });
  });
  test.done();
};

exports['should throw error if outputs as object does not match paths'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next({foo: 'bar'});
  };
  action.outputs = {
    foo: true,
    bar: true
  };
  test.throws(function () {
    ctrl.signal('test', action, {
      bar: []
    });
  });
  test.done();
};

exports['should throw error when output is missing'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next();
  };
  action.output = {
    foo: String
  };
  ctrl.signal('test', action, function () {

  });
  test.throws(function () {
    ctrl.signals.test(true);
  });
  test.done();
};

exports['should throw error when output type is wrong'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next({foo: false});
  };
  action.output = {
    foo: String
  };
  ctrl.signal('test', action, function () {

  });
  test.throws(function () {
    ctrl.signals.test(true);
  });
  test.done();
};

exports['should throw when calling next directly with no defaultOutput and outputs defined'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next({foo: 'bar'});
  };
  action.outputs = {
    foo: {
      bar: String
    }
  };
  ctrl.signal('test', action, {
    foo: []
  });
  test.throws(function () {
    ctrl.signals.test(true);
  });
  test.done();
};

exports['should run when output type is correct'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next({foo: 'bar'});
  };
  action.output = {
    foo: String
  };
  ctrl.signal('test', action, function () {

  });
  test.doesNotThrow(function () {
    ctrl.signals.test(true);
  });
  test.done();
};

exports['should run when outputs type is correct'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {
    next.foo({bar: 'bar'});
  };
  action.outputs = {
    foo: {
      bar: String
    }
  };
  ctrl.signal('test', action, {
    foo: []
  });
  test.doesNotThrow(function () {
    ctrl.signals.test(true);
  });
  test.done();
};

exports['should pass initial payload on first argument'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', function (args) {
    test.deepEqual(args, {foo: 'bar'});
    test.done();
  });
  ctrl.signals.test({foo: 'bar'});
};

exports['should expose a next method to set new args'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', function (args, state, next) {
    next({
      result: true
    });
  }, function (args) {
    test.ok(args.result);
    test.done();
  });
  ctrl.signals.test();
};

exports['should be able to resolve as an async action'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function (args, state, next) {
    async(function () {
      next({
        result: true
      });
    });
  }], function (args) {
    test.ok(args.result);
    test.done();
  });
  ctrl.signals.test();
};

exports['should be able to resolve to default path success'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', function (args, state, next) {
    next.success({result: true});
  }, {
    'success': [function (args) {
      test.ok(args.result);
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should be able to resolve to default path error'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', function (args, state, next) {
    next.error({result: true});
  }, {
    'error': [function (args) {
      test.ok(args.result);
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should be able to resolve to default as async action'] = function (test) {
  var ctrl = Lib.Controller();
  ctrl.signal('test', [function (args, state, next) {
    next.success({result: true});
  }, {
    'success': [function (args) {
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
  ctrl.signal('test', [function (args, state, next) {
    next({
      foo: true
    });
  }, function (args, state, next) {
    next({
      bar: true
    });
  }], function (args) {
    test.deepEqual(args, {foo: true, bar: true});
    test.done();
  });
  ctrl.signals.test();
};

exports['should handle arrays of actions to resolve to multiple paths'] = function (test) {
  var ctrl = Lib.Controller();
  var results = [];
  ctrl.signal('test', [
    function (args, state, next) {
      next.success({
        foo: true
      });
    }, {
      'success': [function (args) {
        results.push(args);
      }],
    },
    function (args, state, next) {
      next.error({
        bar: true
      });
    }, {
      'error': [function (args) {
        results.push(args);
      }]
    }]
  );
  ctrl.signals.test();
  // async trigger of signal
  async(function () {
    // async signals resolve
    async(function () {
      test.equals(results.length, 2);
      test.deepEqual(results[0], {
        foo: true,
        bar: true
      });
      test.done();
    });
  });
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

exports['should throw error when input is defined on action and value is missing or is wrong type'] = function (test) {
  var ctrl = Lib.Controller();
  var action = function (args, state, next) {

  };
  action.input = {
    foo: String
  };
  ctrl.signal('test', function (args, state, next) {
    next();
  }, action);
  test.throws(function () {
    ctrl.signals.test(true);
  });
  test.done();
};
