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

exports['should be able to export all state to plain JS'] = function(test) {
  var cerebral = new Cerebral({
    list: [{
      title: 'foo'
    }]
  });
  var js = cerebral.toJS();
  test.deepEqual(js, {list: [{title: 'foo'}], recorder: { isPlaying: false, isRecording: false, hasRecording: false }});
  js.list = [];
  test.deepEqual(js, {list: [], recorder: { isPlaying: false, isRecording: false, hasRecording: false }});
  test.done();
};