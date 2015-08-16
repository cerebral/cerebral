var Controller = require('./../src/index.js');
var types = require('./../src/types.js');

var Model = function () {
  return function () {
    return {

    };
  };
};

exports['should validate inputs'] = function (test) {
  var ctrl = Controller(Model);
  var action = function () {};
  action.input = {
    foo: String
  };
  ctrl.signal('test', action);
  test.throws(function () {
    ctrl.signals.test(true);
  });
  test.throws(function () {
    ctrl.signals.test(true, {
      foo: 123
    });
  });
  test.doesNotThrow(function () {
    ctrl.signals.test(true, {
      foo: 'bar'
    });
  });
  test.done();
};

exports['should validate ouput'] = function (test) {
  var ctrl = Controller(Model());
  var action = function (args, state, output) {
    output({
      foo: 123
    })
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

exports['should validate outputs'] = function (test) {
  var ctrl = Controller(Model());
  var action = function (args, state, output) {
    output.success({
      foo: 123
    })
  };
  action.outputs = {
    success: {
      foo: String
    }
  };
  ctrl.signal('test', action, {success: []});
  test.throws(function () {
    ctrl.signals.test(true);
  });
  test.done();
};

exports['should validate String'] = function (test) {
  test.ok(types(String, '123'));
  test.ok(!types(String, 123));
  test.ok(!types(String, true));
  test.ok(!types(String, {}));
  test.ok(!types(String, []));
  test.done();
};

exports['should validate Number'] = function (test) {
  test.ok(!types(Number, '123'));
  test.ok(types(Number, 123));
  test.ok(!types(Number, true));
  test.ok(!types(Number, {}));
  test.ok(!types(Number, []));
  test.done();
};

exports['should validate Boolean'] = function (test) {
  test.ok(!types(Boolean, '123'));
  test.ok(!types(Boolean, 123));
  test.ok(types(Boolean, true));
  test.ok(!types(Boolean, {}));
  test.ok(!types(Boolean, []));
  test.done();
};

exports['should validate Object'] = function (test) {
  test.ok(!types(Object, '123'));
  test.ok(!types(Object, 123));
  test.ok(!types(Object, true));
  test.ok(types(Object, {}));
  test.ok(!types(Object, []));
  test.done();
};

exports['should validate Array'] = function (test) {
  test.ok(!types(Array, '123'));
  test.ok(!types(Array, 123));
  test.ok(!types(Array, true));
  test.ok(!types(Array, {}));
  test.ok(types(Array, []));
  test.done();
};

exports['should validate with function'] = function (test) {
  test.ok(types(function (value) {
    test.equals(value, '123');
    return true;
  }, '123'));
  test.ok(!types(function (value) {
    test.equals(value, '123');
    return false;
  }, '123'));
  test.done();
};

exports['should handle falsy values'] = function (test) {
  test.ok(types(String, ''));
  test.ok(types(Boolean, false));
  test.ok(types(Number, 0));
  test.done();
};
