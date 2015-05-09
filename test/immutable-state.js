var Store = require('./../src/Store.js');

exports['throws if passing wrong argument'] = function(test) {
  test.throws(function() {
    new Store();
  });
  test.done();
};

exports['does not throw is passing an object'] = function(test) {
  test.doesNotThrow(function() {
    new Store({});
  });
  test.done();
};

exports['can not mutate the state by native mutation'] = function(test) {
  var state = new Store({}).get();
  state.foo = 'bar';
  test.equal(Object.keys(state).length, 0);
  test.done();
};

exports['can mutate the state by using set'] = function(test) {
  var state = new Store({}).get();
  var newState = state.set('foo', 'bar');
  test.ok(!state.foo);
  test.equal(newState.foo, 'bar');
  test.done();
};

exports['does nested converting of objects'] = function(test) {
  var state = new Store({
    foo: {}
  }).get();
  test.ok(state.foo.__);
  test.done();
};

exports['does nested converting of arrays'] = function(test) {
  var state = new Store({
    foo: [{
      list: []
    }]
  }).get();
  test.ok(state.foo[0].list.__);
  test.done();
};

exports['does not change value on existing state'] = function(test) {
  var state = new Store({
    foo: {}
  }).get();
  state.foo.set('foo', 'bar');
  test.ok(!state.foo.foo);
  test.done();
};

exports['new state returned has change'] = function(test) {
  var state = new Store({
    foo: {}
  }).get();
  state = state.foo.set('foo', 'bar');
  test.equal(state.foo.foo, 'bar');
  test.done();
};

exports['Changes reference on state and object changed'] = function(test) {
  var state = new Store({
    foo: {}
  }).get();
  var newState = state.foo.set('foo', 'bar');
  test.notEqual(state, newState);
  test.notEqual(state.foo, newState.foo);
  test.done();
};

exports['Changes reference on state and array changed'] = function(test) {
  var state = new Store({
    list: []
  }).get();
  var newState = state.list.push('foo');
  test.notEqual(state, newState);
  test.notEqual(state.list, newState.list);
  test.done();
};

exports['PUSH should add an object to a list with the correct path'] = function(test) {
  var state = new Store({
    list: []
  }).get();
  var newState = state.list.push({});
  test.ok(newState.list.length, 1);
  test.deepEqual(newState.list[0].__.path, ['list', 0]);
  test.done();
};

exports['SPLICE should remove an item by index and count'] = function(test) {
  var state = new Store({
    list: [1, 2, 3, 4, 5]
  }).get();
  var newState = state.list.splice(0, 1);
  test.deepEqual(newState.list, [2, 3, 4, 5]);
  newState = newState.list.splice(2, 2);
  test.deepEqual(newState.list, [2, 3]);
  test.done();
};

exports['SPLICE should add items from index in converted format with correct path'] = function(test) {
  var state = new Store({
    list: ['foo']
  }).get();
  var newState = state.list.splice(0, 0, {});
  test.deepEqual(newState.list[0].__.path, ['list', 0]);
  test.done();
};

exports['SPLICE should fix paths of later items and insert additions with correct path'] = function(test) {
  var state = new Store({
    list: [{}, {}, {}, {}]
  }).get();
  var newState = state.list.splice(1, 1, {});
  test.deepEqual(newState.list[1].__.path, ['list', 1]);
  test.deepEqual(newState.list[2].__.path, ['list', 2]);
  test.deepEqual(newState.list[3].__.path, ['list', 3]);
  test.done();
};

exports['CONCAT should add converted items to existing array with correct path'] = function(test) {
  var state = new Store({
    list: []
  }).get();
  var newState = state.list.concat({});
  test.ok(newState.list[0].__);
  test.deepEqual(newState.list[0].__.path, ['list', 0])
  test.done();
};

exports['CONCAT should split arrays into arguments'] = function(test) {
  var state = new Store({
    list: []
  }).get();
  var newState = state.list.concat(['foo'], ['bar']);
  test.deepEqual(newState.list, ['foo', 'bar']);
  test.done();
};

exports['UNSHIFT should add converted item to top of array and adjust paths'] = function(test) {
  var state = new Store({
    list: [{}, {}]
  }).get();
  var newState = state.list.unshift({});
  test.ok(newState.list[0].__);
  test.deepEqual(newState.list[1].__.path, ['list', 1]);
  test.deepEqual(newState.list[2].__.path, ['list', 2]);
  test.done();
};

exports['SHIFT should remove top item of array and adjust paths'] = function(test) {
  var state = new Store({
    list: [{}, {}]
  }).get();
  var newState = state.list.shift();
  test.deepEqual(newState.list[0].__.path, ['list', 0]);
  test.done();
};

exports['UNSHIFT should add converted item to top of array and adjust paths'] = function(test) {
  var state = new Store({
    list: [{}, {}]
  }).get();
  var newState = state.list.unshift({});
  test.ok(newState.list[0].__);
  test.deepEqual(newState.list[1].__.path, ['list', 1]);
  test.deepEqual(newState.list[2].__.path, ['list', 2]);
  test.done();
};

exports['SHIFT should remove top item of array and adjust paths'] = function(test) {
  var state = new Store({
    list: [{}, {}]
  }).get();
  var newState = state.list.shift();
  test.deepEqual(newState.list[0].__.path, ['list', 0]);
  test.done();
};

exports['should allow for array to be set, going through items to fix paths'] = function(test) {
  var state = new Store({
    foo: {
      list: [{}, {}]
    }
  }).get();
  state = state.foo.set('list', state.foo.list.filter(function(item, index) {
    return index === 1
  }));
  test.deepEqual(state.foo.list[0].__.path, ['foo', 'list', 0]);
  test.done();
};

exports['should convert to plain array when using toJS'] = function(test) {
  var state = new Store({
    foo: {
      list: []
    }
  }).get();
  var array = state.foo.list.toJS();
  test.equal(array.__proto__, [].__proto__);
  test.done();
};

exports['should convert to plain object when using toJS'] = function(test) {
  var state = new Store({
    foo: {
      bar: {}
    }
  }).get();
  var object = state.foo.bar.toJS();
  test.equal(object.__proto__, {}.__proto__);
  test.done();
};

exports['should convert deeply when using toJS'] = function(test) {
  var state = new Store({
    foo: {
      list: [{
        foo: []
      }, {
        bar: 'foo'
      }]
    }
  }).get();
  var array = state.foo.list.toJS();
  test.equal(array.__proto__, [].__proto__);
  test.equal(array[0].__proto__, {}.__proto__);
  test.equal(array[0].foo.__proto__, [].__proto__);
  test.equal(array[1].__proto__, {}.__proto__);
  test.done();
};

exports['should merge object'] = function(test) {
  var state = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  }).get();
  var state = state.foo.bar.merge({
    test: 123
  });
  test.equal(state.foo.bar.foo, 'bar');
  test.equal(state.foo.bar.test, 123);
  test.done();
};

exports['should convert objects and arrays when merging'] = function(test) {
  var state = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  }).get();
  var state = state.foo.bar.merge({
    obj: {},
    array: []
  });
  test.ok(state.foo.bar.obj.__);
  test.ok(state.foo.bar.array.__);
  test.done();
};

exports['should throw when trying to merge a non object'] = function(test) {
  var state = new Store({
    foo: {
      bar: {}
    }
  }).get();
  test.throws(function() {
    state = state.foo.bar.merge([]);
  });
  test.done();
};

exports['should work with number primitives in array'] = function(test) {
  var state = new Store({
    items: [0]
  }).get();
  test.equal(state.items[0], 0);
  test.done();
};

exports['the path to a state should be empty'] = function(test) {
  var state = new Store({
    items: [0]
  }).get();
  test.equal(state.__.path.length, 0);
  state = state.items.push('foo');
  test.equal(state.__.path.length, 0);
  test.done();
};

exports['the path to a state should be empty after deep set'] = function(test) {
  var state = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  }).get();
  test.equal(state.__.path.length, 0);
  var state = state.foo.bar.set('test', 123);
  test.equal(state.__.path.length, 0);
  test.done();
};

exports['the path to a state should be empty after deep merge'] = function(test) {
  var state = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  }).get();
  test.equal(state.__.path.length, 0);
  var state = state.foo.bar.merge({
    test: 123
  });
  test.equal(state.__.path.length, 0);
  test.done();
};
