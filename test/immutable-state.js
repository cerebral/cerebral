var Cerebral = require('./../src/Cerebral.js');

exports['throws if passing wrong argument'] = function(test) {
  test.throws(function() {
    new Cerebral();
  });
  test.done();
};

exports['does not throw is passing an object'] = function(test) {
  test.doesNotThrow(function() {
    new Cerebral({});
  });
  test.done();
};

exports['have to pass a path to get'] = function(test) {
  var cerebral = new Cerebral({});
  test.throws(function() {
    cerebral.get();
  });
  test.done();
};

exports['can not mutate state outside signal'] = function(test) {
  var cerebral = new Cerebral({});
  test.throws(function() {
    cerebral.set('foo', 'bar');
  });
  test.done();
};

exports['can not mutate the state by native mutation'] = function(test) {
  var state = new Cerebral({
    foo: {}
  }).get('foo');
  state.foo = 'bar';
  test.equal(Object.keys(state).length, 0);
  test.done();
};

exports['does nested converting of objects'] = function(test) {
  var cerebral = new Cerebral({
    foo: {}
  });
  test.ok(cerebral.get('foo').__);
  test.done();
};

exports['does nested converting of arrays'] = function(test) {
  var cerebral = new Cerebral({
    foo: [{
      list: []
    }]
  });
  test.ok(cerebral.get('foo', 0, 'list').__);
  test.done();
};


exports['does not change value on existing state'] = function(test) {
  var cerebral = new Cerebral({
    foo: {}
  });
  cerebral.get('foo').set('foo', 'bar');
  test.ok(!cerebral.get('foo').foo.foo);
  test.done();
};

exports['new state returned has change'] = function(test) {
  var cerebral = new Cerebral({
    foo: {}
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.set(['foo', 'foo'], 'bar');
  });
  cerebral.signals.test();
  test.equal(cerebral.get('foo', 'foo'), 'bar');
  test.done();
};

exports['Changes reference on state and object changed'] = function(test) {
  var cerebral = new Cerebral({
    foo: {}
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.set(['foo', 'foo'], 'bar');
  });
  var oldFoo = cerebral.get('foo');
  cerebral.signals.test();
  var newFoo = cerebral.get('foo');
  test.notEqual(oldFoo, newFoo);
  test.done();
};


exports['Changes reference on state and array changed'] = function(test) {
  var cerebral = new Cerebral({
    list: []
  });
  cerebral.signal('test', function(cerebral, value) {
    cerebral.push('list', value);
  });
  var oldList = cerebral.get('list');
  cerebral.signals.test('foo');
  var newList = cerebral.get('list');
  test.notEqual(oldList, newList);
  test.done();
};

exports['UNSET should remove a key from an object'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      bar: {}
    }
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.unset(['foo', 'bar']);
    test.deepEqual(cerebral.get('foo', 'bar'), {});
    test.done();
  });
  cerebral.signals.test();
};

exports['PUSH should add an object to a list with the correct path'] = function(test) {
  var cerebral = new Cerebral({
    list: []
  });
  cerebral.signal('test', function(cerebral, value) {
    cerebral.push('list', value);
  });
  cerebral.signals.test({});
  test.ok(cerebral.get('list').length, 1);
  test.deepEqual(cerebral.get('list')[0].__.path, ['list', 0]);
  test.done();
};

exports['SPLICE should remove an item by index and count'] = function(test) {
  var cerebral = new Cerebral({
    list: [1, 2, 3, 4, 5]
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.splice('list', 0, 1);
    test.deepEqual(cerebral.get('list'), [2, 3, 4, 5]);
    cerebral.splice('list', 2, 2);
    test.deepEqual(cerebral.get('list'), [2, 3]);
    test.done();
  });
  cerebral.signals.test();
};


exports['SPLICE should add items from index in converted format with correct path'] = function(test) {
  var cerebral = new Cerebral({
    list: ['foo']
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.splice('list', 0, 0, {});
    test.deepEqual(cerebral.get('list')[0].__.path, ['list', 0]);
    test.done();
  });
  cerebral.signals.test();
};


exports['SPLICE should fix paths of later items and insert additions with correct path'] = function(test) {
  var cerebral = new Cerebral({
    list: [{}, {}, {}, {}]
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.splice('list', 1, 1, {});
    test.deepEqual(cerebral.get('list')[1].__.path, ['list', 1]);
    test.deepEqual(cerebral.get('list')[2].__.path, ['list', 2]);
    test.deepEqual(cerebral.get('list')[3].__.path, ['list', 3]);
    test.done();
  });
  cerebral.signals.test();
};


exports['CONCAT should add converted items to existing array with correct path'] = function(test) {
  var cerebral = new Cerebral({
    list: []
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.concat('list', {});
    test.ok(cerebral.get('list')[0].__);
    test.deepEqual(cerebral.get('list')[0].__.path, ['list', 0])
    test.done();
  });
  cerebral.signals.test();
};


exports['CONCAT should split arrays into arguments'] = function(test) {
  var cerebral = new Cerebral({
    list: []
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.concat('list', ['foo'], ['bar']);
    test.deepEqual(cerebral.get('list'), ['foo', 'bar']);
    test.done();
  });
  cerebral.signals.test();
};


exports['UNSHIFT should add converted item to top of array and adjust paths'] = function(test) {
  var cerebral = new Cerebral({
    list: [{}, {}]
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.unshift('list', {});
    test.ok(cerebral.get('list')[0].__);
    test.deepEqual(cerebral.get('list')[1].__.path, ['list', 1]);
    test.deepEqual(cerebral.get('list')[2].__.path, ['list', 2]);
    test.done();
  });
  cerebral.signals.test();
};


exports['SHIFT should remove top item of array and adjust paths'] = function(test) {
  var cerebral = new Cerebral({
    list: [{}, {}]
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.shift('list');
    test.deepEqual(cerebral.get('list')[0].__.path, ['list', 0]);
    test.done();
  });
  cerebral.signals.test();
};



exports['should allow for array to be set, going through items to fix paths'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      list: [{}, {}]
    }
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.set(['foo', 'list'], cerebral.get('foo', 'list').filter(function(item, index) {
      return index === 1
    }));
    test.deepEqual(cerebral.get('foo', 'list')[0].__.path, ['foo', 'list', 0]);
    test.done();
  });
  cerebral.signals.test();
};


exports['should convert to plain array when using toJS'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      list: []
    }
  });
  var array = cerebral.get('foo', 'list').toJS();
  test.equal(array.__proto__, [].__proto__);
  test.done();
};


exports['should convert to plain object when using toJS'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      bar: {}
    }
  });
  var object = cerebral.get('foo', 'bar').toJS();
  test.equal(object.__proto__, {}.__proto__);
  test.done();
};


exports['should convert deeply when using toJS'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      list: [{
        foo: []
      }, {
        bar: 'foo'
      }]
    }
  });
  var array = cerebral.get('foo', 'list').toJS();
  test.equal(array.__proto__, [].__proto__);
  test.equal(array[0].__proto__, {}.__proto__);
  test.equal(array[0].foo.__proto__, [].__proto__);
  test.equal(array[1].__proto__, {}.__proto__);
  test.done();
};


exports['should merge object'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.merge(['foo', 'bar'], {
      test: 123
    });
    test.equal(cerebral.get('foo', 'bar', 'foo'), 'bar');
    test.equal(cerebral.get('foo', 'bar', 'test'), 123);
    test.done();
  });
  cerebral.signals.test();
};

exports['should convert objects and arrays when merging'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.merge(['foo', 'bar'], {
      obj: {},
      array: []
    });
    test.ok(cerebral.get('foo', 'bar', 'obj').__);
    test.ok(cerebral.get('foo', 'bar', 'array').__);
    test.done();
  });
  cerebral.signals.test();
};

exports['should throw when trying to merge a non object'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      bar: {}
    }
  });
  cerebral.signal('test', function(cerebral) {
    test.throws(function() {
      cerebral.merge(['foo', 'bar'], []);
    });
    test.done();
  });
  cerebral.signals.test();
};


exports['should work with number primitives in array'] = function(test) {
  var cerebral = new Cerebral({
    items: [0]
  });
  test.equal(cerebral.get('items')[0], 0);
  test.done();
};


exports['the path to a state should be empty'] = function(test) {
  var cerebral = new Cerebral({
    items: [0]
  });
  cerebral.signal('test', function(cerebral) {
    test.equal(cerebral.get([]).__.path.length, 0);
    cerebral.push('items', 'foo');
    test.equal(cerebral.get([]).__.path.length, 0);
    test.done();
  });
  cerebral.signals.test();
};


exports['the path to a state should be empty after deep set'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  cerebral.signal('test', function(cerebral) {
    test.equal(cerebral.get([]).__.path.length, 0);
    cerebral.set(['foo', 'bar', 'test'], 123);
    test.equal(cerebral.get([]).__.path.length, 0);
    test.done();
  });
  cerebral.signals.test();
};

exports['the path to a state should be empty after deep merge'] = function(test) {
  var cerebral = new Cerebral({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  cerebral.signal('test', function(cerebral) {
    test.equal(cerebral.get([]).__.path.length, 0);
    cerebral.merge(['foo', 'bar'], {
      test: 123
    });
    test.equal(cerebral.get([]).__.path.length, 0);
    test.done();
  });
  cerebral.signals.test();
};
