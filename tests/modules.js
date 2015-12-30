var Controller = require('./../src/index.js');
var types = require('./../src/types.js');

var Model = function () {
  return function () {
    return {

    };
  };
};

exports['should be able to register a module'] = function (test) {
  var ctrl = Controller(Model);
  ctrl.register({
    test: {
      init: function () {

      }
    }
  });
  test.ok(ctrl.modules.test);
  test.done();
};

exports['should pass the controller its name and its signals to the init method'] = function (test) {
  var ctrl = Controller(Model);
  test.expect(3);
  ctrl.register({
    test: {
      init: function (args) {
        test.equal(args.controller, ctrl);
        test.equal(args.name, 'test');
        test.deepEqual(args.signals, {});
      }
    }
  });
  test.done();
};
