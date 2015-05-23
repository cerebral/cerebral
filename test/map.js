var Cerebral = require('./../src/Cerebral.js');


exports['should run maps on instantiation'] = function(test) {
  var cerebral = new Cerebral({
    foo: function () {
      return {
        initialState: [],
        lookupState: ['bar'],
        get: function (cerebral, lookupState, array) {
          return lookupState.bar;
        }
      };
    },
    bar: 'foo'
  });
  test.deepEqual(cerebral.get('foo'), 'foo');
  test.done();
};

exports['should allow object definition of deps'] = function(test) {
  var cerebral = new Cerebral({
    foo: function () {
      return {
        initialState: [],
        lookupState: {
          foo: 'bar'
        },
        get: function (cerebral, lookupState, array) {
          return lookupState.foo;
        }
      };
    },
    bar: 'foo'
  });
  test.deepEqual(cerebral.get('foo'), 'foo');
  test.done();
};

exports['should allow array definition of deps'] = function(test) {
  var cerebral = new Cerebral({
    foo: function () {
      return {
        initialState: [],
        lookupState: [['bar', 'foo']],
        get: function (cerebral, lookupState, array) {
          return lookupState.foo;
        }
      };
    },
    bar: {
      foo: 'bar'
    }
  });
  test.deepEqual(cerebral.get('foo'), 'bar');
  test.done();
};

exports['should update when state changes'] = function(test) {
  var cerebral = new Cerebral({
    foo: function () {
      return {
        initialState: [],
        lookupState: ['bar'],
        get: function (cerebral, lookupState, array) {
          return array.length;
        }
      };
    },
    bar: false
  });
  cerebral.signal('test', function () {
    cerebral.push('foo', 'bar');
  });
  test.equals(cerebral.get('foo'), 0);
  cerebral.signals.test();
  test.equals(cerebral.get('foo'), 1);
  test.done();
};

exports['should update when lookupState changes'] = function(test) {
  var cerebral = new Cerebral({
    foo: function () {
      return {
        initialState: [],
        lookupState: ['bar'],
        get: function (cerebral, lookupState, array) {
          return lookupState.bar;
        }
      };
    },
    bar: 'foo'
  });
  cerebral.signal('test', function () {
    cerebral.set('bar', 'bar');
  });
  test.equals(cerebral.get('foo'), 'foo');
  cerebral.signals.test();
  test.equals(cerebral.get('foo'), 'bar');
  test.done();
};
