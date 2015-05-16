var Promise = require('es6-promise').Promise;
var Cerebral = require('./../src/Cerebral.js');

exports['should keep track of signals'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function() {
    cerebral.set('foo', 'bar2');
  });
  cerebral.signals.test();
  test.equals(cerebral.getMemories().length, 1);
  test.equals(cerebral.getMemories()[0].name, 'test');
  test.done();
};

exports['should keep track of actions'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function Action1() {
    cerebral.set('foo', 'bar2');
  }, function Action2() {
    cerebral.set('foo', 'bar3');
  });
  cerebral.signals.test();
  test.equals(cerebral.getMemories()[0].actions.length, 2);
  test.equals(cerebral.getMemories()[0].actions[0].name, 'Action1');
  test.equals(cerebral.getMemories()[0].actions[1].name, 'Action2');
  test.done();
};

exports['should keep track of mutations'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function() {
    cerebral.set('foo', 'bar2');
  });
  cerebral.signals.test();
  test.equals(cerebral.getMemories()[0].actions[0].mutations.length, 1);
  test.equals(cerebral.getMemories()[0].actions[0].mutations[0].name, 'set');
  test.deepEqual(cerebral.getMemories()[0].actions[0].mutations[0].args, ['foo', 'bar2']);
  test.deepEqual(cerebral.getMemories()[0].actions[0].mutations[0].path, []);
  test.done();
};

exports['should be able to revert state'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function(cerebral, value) {
    cerebral.set('foo', value);
  });
  cerebral.signals.test('bar2');
  cerebral.signals.test('bar3');
  cerebral.remember(-1);
  test.equals(cerebral.get('foo'), 'bar');
  cerebral.remember(0);
  test.equals(cerebral.get('foo'), 'bar2');
  test.done();
};

exports['should run async actions synchronously'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function Action1(cerebral, value) {
    return new Promise(function(resolve) {
      resolve(value);
    });
  }, function Action2(cerebral, value) {
    cerebral.set('foo', value);
  });
  cerebral.once('update', function() {
    cerebral.remember(-1);
    test.equals(cerebral.get('foo'), 'bar');
    cerebral.remember(0);
    test.equals(cerebral.get('foo'), 'bar2');
    test.done();
  });
  cerebral.signals.test('bar2');
};
