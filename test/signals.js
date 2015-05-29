var Cerebral = require('./../src/Cerebral.js');
var Promise = require('es6-promise').Promise;


exports['should be able to create a signal'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function() {});
  cerebral.on('update', function() {
    test.done();
  });
  cerebral.signals.test();
};

exports['should be able to run multiple synchronous actions'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  var counter = 0;
  cerebral.signal('test', function() {
    counter++;
  }, function() {
    counter++;
  });
  cerebral.on('update', function() {
    test.equals(counter, 2);
    test.done();
  });
  cerebral.signals.test();
};

exports['should be able to run async actions'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  var counter = 0;
  cerebral.signal('test', function() {
    return new Promise(function(resolve) {
      counter++;
      resolve();
    });
  }, function() {
    counter++;
  });
  cerebral.once('update', function() {
    test.equals(counter, 2);
    test.done();
  });
  cerebral.signals.test();
};

exports['should be able to run async actions in parallell'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  var counter = 0;
  cerebral.signal('test', [function() {
    return new Promise(function(resolve) {
      counter++;
      resolve('foo');
    });
  }, function() {
    return new Promise(function(resolve) {
      counter++;
      resolve('bar');
    });
  }], function(cerebral, result) {
    test.deepEqual(result, ['foo', 'bar']);
    counter++;
  });
  cerebral.once('update', function() {
    test.equals(counter, 3);
    test.done();
  });
  cerebral.signals.test();
};

