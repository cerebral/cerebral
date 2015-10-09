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

exports['should have a computation method'] = function (test) {
  var controller = Controller(Model());
  test.ok(controller.compute);
  test.done();
};

exports['should return object with paths as key and function as value'] = function (test) {
  var compute = function () {};
  var result = utils.extractMatchingPathFunctions({
    foo: compute
  }, {
    foo: 'bar'
  });
  test.deepEqual(result, {
    'foo': compute
  });

  test.done();
};

exports['should return path if mismatch in tree'] = function (test) {

  result = utils.extractMatchingPathFunctions( {
    test: function () {}
  }, {
    foo: 'bar'
  });

  test.deepEqual(result, ['test']);

  test.done();
};

exports['should support deep matching'] = function (test) {
  var compute = function () {};
  var result = utils.extractMatchingPathFunctions({
    admin: {
      foo: compute
    }
  }, {
    admin: {
      foo: 'bar'
    }
  });
  test.deepEqual(result, {
    'admin.foo': compute
  });

  result = utils.extractMatchingPathFunctions( {
    admin: {
      test: function () {}
    }
  }, {
    admin: {
      foo: 'bar'
    }
  });

  test.deepEqual(result, ['admin', 'test']);

  test.done();
};

exports['should support multiple computed state'] = function (test) {
  var compute = function () {};
  var result = utils.extractMatchingPathFunctions({
    admin: {
      foo: compute,
      bar: compute
    }
  }, {
    admin: {
      foo: 'bar',
      bar: 'far'
    }
  });
  test.deepEqual(result, {
    'admin.foo': compute,
    'admin.bar': compute
  });

  test.done();
};



exports['should ignore other values'] = function (test) {
  var compute = function () {};
  var result = utils.extractMatchingPathFunctions({
    admin: {
      foo: compute
    }
  }, {
    admin: {
      foo: 'bar'
    },
    bool: true,
    array: [],
    number: 123
  });
  test.deepEqual(result, {
    'admin.foo': compute
  });
  test.done();
};

exports['should throw error if passed object does not match model'] = function (test) {
  var model = Model({
    foo: 'bar'
  });
  var controller = Controller(model);
  test.throws(function () {
    controller.compute({
      wrong: function () {

      }
    })
  })
  test.done();
};

exports['should pass current state store value as first argument'] = function (test) {
  var model = Model({
    foo: 'bar'
  });
  var controller = Controller(model);
  controller.compute({
    foo: function (get, value) {
      test.equal(value, 'bar');
    }
  });
  test.expect(1);
  controller.get('foo');
  test.done();
};

exports['should pass get function to grab state'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var controller = Controller(model);
  controller.compute({
    foo: function (get, value) {
      test.equal(get(['test']), 'hest');
    }
  });
  test.expect(1);
  controller.get('foo');
  test.done();
};

exports['should not rerun if no values change'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var controller = Controller(model);
  controller.compute({
    foo: function (get, value) {
      test.equal(get(['test']), 'hest');
    }
  });
  test.expect(1);
  controller.get('foo');
  controller.get('foo');
  test.done();
};

exports['should rerun if value changes'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var controller = Controller(model);
  controller.compute({
    foo: function (get, value) {
      test.equal(get(['test']), 'hest');
    }
  });
  test.expect(2);
  controller.get('foo');
  var signal = [
    function (input, state) {
      state.set('foo', 'bar2')
    }
  ];

  controller.signal('test', signal);
  controller.once('signalEnd', function () {
    controller.get('foo');
    test.done();
  });
  controller.signals.test();
};

exports['should rerun if previously grabbed value changes'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var run = 0;
  var controller = Controller(model);
  controller.compute({
    foo: function (get, value) {
      run++;
      if (run === 1) {
        test.equal(get(['test']), 'hest');
      } else {
        test.equal(get(['test']), 'hest2');
      }
    }
  });
  test.expect(2);
  controller.get('foo');
  var signal = [
    function (input, state) {
      state.set('test', 'hest2')
    }
  ];

  controller.signal('test', signal);
  controller.once('signalEnd', function () {
    controller.get('foo');
    test.done();
  });
  controller.signals.test();
};

exports['should cache after value change'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var controller = Controller(model);
  controller.compute({
    foo: function (get, value) {
      test.equal(get(['test']), 'hest');
    }
  });
  test.expect(2);
  controller.get('foo');
  var signal = [
    function (input, state) {
      state.set('foo', 'bar2')
    }
  ];

  controller.signal('test', signal);
  controller.once('signalEnd', function () {
    controller.get('foo');
    controller.get('foo');
    test.done();
  });
  controller.signals.test();
};

exports['should cache after previously grabbed value change'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var run = 0;
  var controller = Controller(model);
  controller.compute({
    foo: function (get, value) {
      run++;
      if (run === 1) {
        test.equal(get(['test']), 'hest');
      } else {
        test.equal(get(['test']), 'hest2');
      }
    }
  });
  test.expect(2);
  controller.get('foo');
  var signal = [
    function (input, state) {
      state.set('test', 'hest2')
    }
  ];

  controller.signal('test', signal);
  controller.once('signalEnd', function () {
    controller.get('foo');
    controller.get('foo');
    test.done();
  });
  controller.signals.test();
};

exports['should handle complex scenario'] = function (test) {
  var model = Model({
    data: {
      messages: {}
    },
    lists: {
      displayedMessages: [],
      likedMessages: []
    }
  });

  var controller = Controller(model);

  controller.compute({
    lists: {
      displayedMessages: function (get, ids) {
        return ids.map(function (id) { return get(['data', 'messages', id])});
      },
      likedMessages: function (get) {
        var messages = get(['data', 'messages']);
        return Object.keys(messages).map(function (key) {
          return messages[key];
        }).filter(function (message) {
          return message.liked;
        });
      }
    }
  });

  test.deepEqual(controller.get(['lists', 'displayedMessages']), []);
  test.deepEqual(controller.get(['lists', 'likedMessages']), []);

  var signal = [
    function (input, state) {
      state.merge(['data', 'messages'], {
        '123': {title: 'test', liked: true},
        '456': {title: 'test2', liked: true},
        '789': {title: 'test3', liked: false},
        '091': {title: 'test4', liked: false}
      });
      state.set(['lists', 'displayedMessages'], ['123']);
    }
  ];
  
  controller.signal('test', signal);

  controller.once('signalEnd', function () {

    test.deepEqual(controller.get(['lists', 'displayedMessages']), [{
      title: 'test',
      liked: true
    }]);
    test.equal(controller.get(['lists', 'likedMessages']).length, 2);
    test.done();

  });

  controller.signals.test();

};
