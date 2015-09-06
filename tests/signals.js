var Controller = require('./../src/index.js');
var async = function (cb) {
  setTimeout(cb, 0);
};
var Model = function () {
  return function () {
    return {
      get: function () {

      },
      mutators: {
        set: function (path, value) {
          state = {};
          state[path.pop()] = value;
        }
      }
    }
  };
};

exports['should run sync signals'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test');
  test.ok(typeof ctrl.signals.test === 'function');
  test.done();
};

exports['should trigger an action when run'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', function () {
    test.ok(true);
    test.done();
  });
  ctrl.signals.test();
};

exports['should be able to define custom outputs as arrays'] = function (test) {
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output.foo({foo: 'bar'});
  };
  action.outputs = ['foo'];
  ctrl.signal('test', action, {
    foo: [function (input) {
      test.deepEqual(input, {foo: 'bar'});
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should be able to define default custom path'] = function (test) {
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output({foo: 'bar'});
  };
  action.defaultOutput = 'bar';
  action.outputs = ['foo', 'bar'];
  ctrl.signal('test', action, {
    foo: [],
    bar: [function (input) {
      test.deepEqual(input, {foo: 'bar'});
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should throw error if paths are missing'] = function (test) {
  var ctrl = Controller(Model());
  var action = function MyAction (input, state, output) {
    output({foo: 'bar'});
  };
  action.outputs = ['foo', 'bar'];
  test.throws(function () {
    ctrl.signal('test', action);
  });
  test.done();
};

exports['should throw error if outputs as array does not match paths'] = function (test) {
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output({foo: 'bar'});
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
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output({foo: 'bar'});
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
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output();
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
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output({foo: false});
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
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output({foo: 'bar'});
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
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output({foo: 'bar'});
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
  var ctrl = Controller(Model());
  var action = function (input, state, output) {
    output.foo({bar: 'bar'});
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
  var ctrl = Controller(Model());
  ctrl.signal('test', function (input) {
    test.deepEqual(input, {foo: 'bar'});
    test.done();
  });
  ctrl.signals.test({foo: 'bar'});
};

exports['should expose a output method to set new args'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', function (input, state, output) {
    output({
      result: true
    });
  }, function (input) {
    test.ok(input.result);
    test.done();
  });
  ctrl.signals.test();
};

exports['should be able to resolve as an async action'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', [function (input, state, output) {
    async(function () {
      output({
        result: true
      });
    });
  }], function (input) {
    test.ok(input.result);
    test.done();
  });
  ctrl.signals.test();
};

exports['should be able to resolve to default path success'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', function (input, state, output) {
    output.success({result: true});
  }, {
    'success': [function (input) {
      test.ok(input.result);
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should be able to resolve to default path error'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', function (input, state, output) {
    output.error({result: true});
  }, {
    'error': [function (input) {
      test.ok(input.result);
      test.done();
    }]
  });
  ctrl.signals.test();
};

exports['should be able to resolve to default as async action'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', [function (input, state, output) {
    output.success({result: true});
  }, {
    'success': [function (input) {
      test.ok(input.result);
      test.done();
    }]
  }]);
  ctrl.signals.test();
};

exports['should expose mutation and a get method, if passed'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', function (input, state) {
    test.ok(typeof state.get === 'function');
    test.ok(typeof state.set === 'function');
    test.done();
  });
  ctrl.signals.test();
};

exports['should handle arrays of actions to run in parallell'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', [function (input, state, output) {
    output({
      foo: true
    });
  }, function (input, state, output) {
    output({
      bar: true
    });
  }], function (input) {
    test.deepEqual(input, {foo: true, bar: true});
    test.done();
  });
  ctrl.signals.test();
};

exports['should handle arrays of actions to resolve to multiple paths'] = function (test) {
  var ctrl = Controller(Model());
  var results = [];
  ctrl.signal('test', [
    function (input, state, output) {
      output.success({
        foo: true
      });
    }, {
      'success': [function (input) {
        results.push(input);
      }],
    },
    function (input, state, output) {
      output.error({
        bar: true
      });
    }, {
      'error': [function (input) {
        results.push(input);
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

exports['should trigger paths when individual async is done'] = function (test) {
  var ctrl = Controller(Model());
  var results = [];
  ctrl.signal('test', [
    function (input, state, output) {
      async(function () {
        output.success({
          value: 'foo'
        });
      });
    }, {
      'success': [function (input) {
        results.push(input.value);
      }],
    },
    function (input, state, output) {
      output.error({
        value: 'bar'
      });
    }, {
      'error': [function (input) {
        results.push(input.value);
      }]
    }]
  );
  ctrl.once('signalEnd', function () {
    test.equal(results[0], 'bar');
    test.equal(results[1], 'foo');
    test.done();
  });
  ctrl.signals.test();

};

exports['should wait to resolve top level async array when nested async arrays are running'] = function (test) {
  var ctrl = Controller(Model());
  var results = [];
  ctrl.signal('test', [
    function (input, state, output) {
      async(function () {
        output.success({
          value: 'foo'
        });
      });
    }, {
      'success': [
        [
          function (input, state, output) {
            results.push(input.value);
            output();
          }
        ]
      ],
    }], function () {
      results.push('bar');
    }
  );
  ctrl.once('signalEnd', function () {
    test.equal(results[0], 'foo');
    test.equal(results[1], 'bar');
    test.done();
  });
  ctrl.signals.test();
};

exports['should throw error when trying to mutate with an async action'] = function (test) {
  var ctrl = Controller(Model());
  ctrl.signal('test', [function (input, state) {
    test.throws(function () {
      state.set('foo', 'bar');
    });
    test.done();
  }]);
  ctrl.signals.test();
};

exports['should allow services'] = function (test) {
  var ctrl = Controller(Model(), {
    foo: 'bar'
  });
  ctrl.signal('test', function (input, state, output, services) {
    test.deepEqual(services, {foo: 'bar'});
    test.done();
  });
  ctrl.signals.test();
};

exports['should trigger signal synchronously when passing true as first argument'] = function (test) {
  var ctrl = Controller(Model());
  var hasRun = false;
  ctrl.signal('test', function () {
    hasRun = true;
  });
  ctrl.signals.test(true);
  test.ok(hasRun);
  test.done();
};

exports['should throw error when input is defined on action and value is missing or is wrong type'] = function (test) {
  var ctrl = Controller(Model());
  var action = function () {

  };
  action.input = {
    foo: String
  };
  ctrl.signal('test', function (input, state, output) {
    output();
  }, action);
  test.throws(function () {
    ctrl.signals.test(true);
  });
  test.done();
};
