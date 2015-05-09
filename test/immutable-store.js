var Store = require('./../src/Store.js');

exports['should trigger event on mutation'] = function (test) {
  var store = new Store({
    foo: 'bar'
  });
  store.on('update', function () {
    test.done();
  });
  store.set(['foo'], 'bar2');
};

exports['should be able to use paths from passed immutables'] = function (test) {
  var store = new Store({
    list: [{
      title: 'foo'
    }]
  });
  var item = store.get('list')[0];
  store.set([item, 'title'], 'bar');
  test.equal(store.get('list', 0, 'title'), 'bar');
  test.done();
};

exports['should store mutation change for travelling'] = function (test) {
  var store = new Store({
    foo: 'bar'
  });
  store.set(['foo'], 'bar2');
  test.equal(store.getHistory().length, 1);
  test.done();
};

exports['should be able to travel back in time'] = function (test) {
  var store = new Store({
    foo: 'bar'
  });
  store.set(['foo'], 'bar2');
  test.equal(store.get('foo'), 'bar2');
  var store = store.travel(0);
  test.equal(store.get('foo'), 'bar');
  test.done();
};

exports['should expose set method'] = function (test) {
  var store = new Store({
    foo: 'bar'
  });
  store.set(['foo'], 'bar2');
  test.equal(store.get('foo'), 'bar2');
  test.done();
};

exports['should expose push method'] = function (test) {
  var store = new Store({
    list: []
  });
  store.push(['list'], 'foo');
  test.equal(store.get(['list', 0]), 'foo');
  test.done();
};

exports['should expose merge method'] = function (test) {
  var store = new Store({
    foo: {}
  });
  store.merge(['foo'], {
    foo: 'bar'
  });
  test.equal(store.get(['foo', 'foo']), 'bar');
  test.done();
};

exports['should be able to merge the store itself'] = function (test) {
  var store = new Store({
    foo: {}
  });
  store.merge({
    bar: {}
  });
  test.deepEqual(store.get(), {foo: {}, bar: {}});
  test.done();
};

exports['should expose unshift method'] = function (test) {
  var store = new Store({
    list: ['foo']
  });
  store.unshift(['list'], 'bar');
  test.deepEqual(store.get('list'), ['bar', 'foo']);
  test.done();
};

exports['should expose splice method'] = function (test) {
  var store = new Store({
    list: ['foo']
  });
  store.splice(['list'], 0, 1, 'bar');
  test.deepEqual(store.get('list'), ['bar']);
  test.done();
};

exports['should expose shift method'] = function (test) {
  var store = new Store({
    list: ['foo']
  });
  store.shift(['list']);
  test.equal(store.get('list').length, 0);
  test.done();
};

exports['should expose concat method'] = function (test) {
  var store = new Store({
    list: ['foo']
  });
  store.concat(['list'], ['bar']);
  test.deepEqual(store.get('list'), ['foo', 'bar']);
  test.done();
};

exports['should expose pop method'] = function (test) {
  var store = new Store({
    list: ['foo']
  });
  store.pop(['list']);
  test.equal(store.get('list').length, 0);
  test.done();
};