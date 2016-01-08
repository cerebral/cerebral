var Controller = require('./../src/index.js');
var types = require('./../src/types.js');

var Model = function (initialState) {
  var state = initialState;
  return function () {
    return {
      accessors: {
        get: function () {
          return state;
        }
      },
      mutators: {
        set: function (path, value) {
          var traverseState = state;
          path = path.slice();
          var setKey = path.pop();
          while (path.length) {
            var key = path.shift();
            traverseState = traverseState[key] = traverseState[key] || {};
          }
          traverseState[setKey] = value;
        }
      }
    };
  };
};

exports['should be able to register a module'] = function (test) {
  var ctrl = Controller(Model({}));
  ctrl.registerModules({
    test: function () {}
  });
  test.ok(ctrl.modules.test);
  test.done();
};

exports['should pass the module and controller, and expose module name and path on controller'] = function (test) {
  var ctrl = Controller(Model({}));
  test.expect(5);
  ctrl.registerModules({
    test: function (module, controller) {
      test.equal(controller, ctrl);
      test.equal(module.name, 'test');
      test.deepEqual(module.signals, {});
    }
  });
  test.equal(ctrl.modules.test.name, 'test');
  test.deepEqual(ctrl.modules.test.path, ['test']);
  test.done();
};

exports['should be able to add a signal'] = function (test) {
  var ctrl = Controller(Model({}));
  ctrl.registerModules({
    test: function (module) {
      module.signal('test', []);
      module.signalSync('test2', []);
    }
  });
  test.ok(ctrl.signals.test.test);
  test.ok(ctrl.signals.test.test2);
  test.done();
};

exports['should be able to add a service'] = function (test) {
  var ctrl = Controller(Model({}));
  ctrl.registerModules({
    test: function (module) {
      module.service('test', {});
    }
  });
  test.ok(ctrl.services.test.test);
  test.done();
};

exports['should expose module on actions running on a module signal'] = function (test) {
  var ctrl = Controller(Model({}));
  test.expect(1);
  ctrl.registerModules({
    test: function (module) {
      module.signal('test', [
        function action (arg) {
          test.ok(arg.module);
        }
      ])
    }
  });
  ctrl.signals.test.test.sync();
  test.done();
};

exports['should expose modules on all actions'] = function (test) {
  var ctrl = Controller(Model({}));
  test.expect(1);
  ctrl.signal('test', [
    function action (arg) {
      test.ok(arg.modules.test);
    }
  ])
  ctrl.registerModules({
    test: function () {}
  });
  ctrl.signals.test.sync();
  test.done();
};

exports['should be able to add namespaced state'] = function (test) {
  var ctrl = Controller(Model({}));
  test.expect(1);
  ctrl.registerModules({
    test: function (module) {
      module.state({
        foo: 'bar'
      });
    }
  });
  test.deepEqual(ctrl.get(), {test: {foo: 'bar'}});
  test.done();
};

exports['should be able to add an alias'] = function (test) {
  var ctrl = Controller(Model({}));
  test.expect(2);
  ctrl.registerModules({
    test: function (module) {
      module.alias('cerebral-module-test');
    }
  });
  test.ok(ctrl.modules['cerebral-module-test']);
  test.ok(ctrl.modules.test);
  test.done();
};

exports['should be able to add a submodule with namespaced state, signals and services'] = function (test) {
  var ctrl = Controller(Model({}));
  test.expect(2);
  ctrl.registerModules({
    test: function (module) {
      module.registerModules({
        sub: function (module) {
          module.signal('test', [
            function action (arg) {
              test.ok(arg.modules.test.sub.services.test);
              test.deepEqual(arg.state.get(), {test: {sub: {foo: 'bar'} } });
            }
          ]);
          module.service('test', {});
          module.state({foo: 'bar'});
        }
      });
    }
  });
  ctrl.signals.test.sub.test.sync();
  test.done();
};
