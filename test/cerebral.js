var Cerebral = require('./../src/Cerebral.js');

exports['should trigger event on mutation'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function() {
    cerebral.set('foo', 'bar2');
  });
  cerebral.on('update', function() {
    test.done();
  });
  cerebral.signals.test();
};


exports['should be able to use paths from passed immutables'] = function(test) {
  var cerebral = new Cerebral({
    list: [{
      title: 'foo'
    }]
  });
  cerebral.signal('test', function(cerebral) {
    var item = cerebral.get('list')[0];
    cerebral.set([item, 'title'], 'bar');
    test.equal(cerebral.get('list', 0, 'title'), 'bar');
    test.done();
  });
  cerebral.signals.test();
};


exports['should store mutation change for travelling'] = function(test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function(cerebral) {
    cerebral.set('foo', 'bar2');
  });
  cerebral.signals.test();
  test.equal(cerebral.getMemories().length, 1);
  test.equal(cerebral.getMemories()[0].actions.length, 1);
  test.equal(cerebral.getMemories()[0].actions[0].mutations.length, 1);
  test.done();
};


exports['should be able to travel back in time'] = function (test) {
  var cerebral = new Cerebral({
    foo: 'bar'
  });
  cerebral.signal('test', function (cerebral) {
    cerebral.set('foo', 'bar2');
  });
  cerebral.signals.test();
  test.equal(cerebral.get('foo'), 'bar2');
  cerebral.remember(-1);
  test.equal(cerebral.get('foo'), 'bar');
  test.done();
};
