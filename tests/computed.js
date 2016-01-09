var Controller = require('./../src/index.js');
var utils = require('./../src/utils.js');
var async = function (cb) {
  setTimeout(cb, 0);
};
var Model = function (state) {
  return function () {
    return {
      accessors: {
        get: function (path) {
          path = typeof path === 'string' ? [].slice.call(arguments) : path;
          path = path ? path.slice() : [];
          var currentPath = state;
          while(path.length) {
            currentPath = currentPath[path.shift()];
          }
          return currentPath;
        }
      },
      mutators: {
        set: function (path, value) {
          path = path ? path.slice() : [];
          var key = path.pop();
          var currentPath = state;
          while(path.length) {
            currentPath = currentPath[path.shift()];
          }
          currentPath[key] = value;
        },
        merge: function (path, value) {
          path = path ? path.slice() : [];
          var key = path.pop();
          var currentPath = state;
          while(path.length) {
            currentPath = currentPath[path.shift()];
          }
          currentPath[key] = Object.keys(value).reduce(function (path, key) {
            path[key] = value[key];
            return path;
          }, {})
        }
      }
    }
  };
};

exports['should pass get function to grab state from state store'] = function (test) {
  var model = Model({
    foo: 'bar'
  });
  var foo = function (get) {
    test.ok(typeof get === 'function');
    test.equal(get(['foo']), 'bar');
  };

  var controller = Controller(model);
  test.expect(2);
  controller.get(foo);
  test.done();
};

exports['should pass get function to grab state'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var foo = function (get, value) {
    test.equal(get(['test']), 'hest');
  };
  var controller = Controller(model);
  test.expect(1);
  controller.get(foo);
  test.done();
};

exports['should not rerun if no values change'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var foo = function (get, value) {
    test.equal(get(['test']), 'hest');
  };
  var controller = Controller(model);
  test.expect(1);
  controller.get(foo);
  controller.get(foo);
  test.done();
};

exports['should rerun if previously grabbed value changes'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var run = 0;
  var foo = function (get) {
    run++;
    if (run === 1) {
      test.equal(get(['test']), 'hest');
    } else {
      test.equal(get(['test']), 'hest2');
    }
  }
  var controller = Controller(model);
  test.expect(2);
  controller.get(foo);
  var signal = [
    function (args) {
      args.state.set('test', 'hest2')
    }
  ];

  controller.signals({
    'test': signal
  });
  controller.once('signalEnd', function () {
    controller.get(foo);
    test.done();
  });
  controller.getSignals().test();
};

exports['should cache after previously grabbed value change'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var run = 0;
  var foo = function (get) {
    run++;
    if (run === 1) {
      test.equal(get(['test']), 'hest');
    } else {
      test.equal(get(['test']), 'hest2');
    }
  }
  var controller = Controller(model);
  test.expect(2);
  controller.get(foo);
  var signal = [
    function (args) {
      args.state.set(['test'], 'hest2')
    }
  ];

  controller.signals({
    'test': signal
  });
  controller.once('signalEnd', function () {
    controller.get(foo);
    controller.get(foo);
    test.done();
  });
  controller.getSignals().test.sync();
};

exports['should handle complex scenario'] = function (test) {
  var model = Model({
    data: {
      messages: {}
    },
    lists: {
      displayedMessagesIds: []
    }
  });

  var computed = {
    displayedMessages: function (get) {
      return get(['lists', 'displayedMessagesIds']).map(function (id) { return get(['data', 'messages', id])});
    },
    likedMessages: function (get) {
      var messages = get(['data', 'messages']);
      return Object.keys(messages).map(function (key) {
        return messages[key];
      }).filter(function (message) {
        return message.liked;
      });
    }
  };
  var controller = Controller(model);

  test.deepEqual(controller.get(computed.displayedMessages), []);
  test.deepEqual(controller.get(computed.likedMessages), []);

  var signal = [
    function (args) {
      args.state.merge(['data', 'messages'], {
        '123': {title: 'test', liked: true},
        '456': {title: 'test2', liked: true},
        '789': {title: 'test3', liked: false},
        '091': {title: 'test4', liked: false}
      });
      args.state.set(['lists', 'displayedMessagesIds'], ['123']);
    }
  ];

  controller.signals({
    'test': signal
  });

  controller.once('signalEnd', function () {

    test.deepEqual(controller.get(computed.displayedMessages), [{
      title: 'test',
      liked: true
    }]);
    test.equal(controller.get(computed.likedMessages).length, 2);
    test.done();

  });

  controller.getSignals().test();

};

exports['should allow use of other computed'] = function (test) {
  var model = Model({
    foo: 'bar'
  });
  var bar = function () {
    return 'foo';
  };
  var foo = function (get) {
    test.equal(get(bar), 'foo');
  };

  var controller = Controller(model);
  test.expect(1);
  controller.get(foo);


  test.done();
};

exports['should allow use of computed inside actions'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var foo = function () {
    return 'bar';
  }
  var controller = Controller(model);
  test.expect(1);
  controller.get(foo);
  var signal = [
    function (args) {
      test.equal(args.state.get(foo), 'bar');
      test.done();
    }
  ];

  controller.signals({
    'test': signal
  });
  controller.getSignals().test.sync();
};
