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

exports['should pass get function to grab state from state store'] = function (test) {
  var model = Model({
    foo: 'bar'
  });
  var controller = Controller(model);
  controller.compute({
    foo: function (get) {
      test.ok(typeof get === 'function');
      test.equal(get(['foo']), 'bar');
    }
  });
  test.expect(2);
  controller.getComputedValue('foo');
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
  controller.getComputedValue('foo');
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
  controller.getComputedValue('foo');
  controller.getComputedValue('foo');
  test.done();
};

exports['should rerun if previously grabbed value changes'] = function (test) {
  var model = Model({
    foo: 'bar',
    test: 'hest'
  });
  var run = 0;
  var controller = Controller(model);
  controller.compute({
    foo: function (get) {
      run++;
      if (run === 1) {
        test.equal(get(['test']), 'hest');
      } else {
        test.equal(get(['test']), 'hest2');
      }
    }
  });
  test.expect(2);
  controller.getComputedValue('foo');
  var signal = [
    function (input, state) {
      state.set('test', 'hest2')
    }
  ];

  controller.signal('test', signal);
  controller.once('signalEnd', function () {
    controller.getComputedValue('foo');
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
    foo: function (get) {
      run++;
      if (run === 1) {
        test.equal(get(['test']), 'hest');
      } else {
        test.equal(get(['test']), 'hest2');
      }
    }
  });
  test.expect(2);
  controller.getComputedValue('foo');
  var signal = [
    function (input, state) {
      state.set(['test'], 'hest2')
    }
  ];

  controller.signal('test', signal);
  controller.once('signalEnd', function () {
    controller.getComputedValue('foo');
    controller.getComputedValue('foo');
    test.done();
  });
  controller.signals.test.sync();
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

  var controller = Controller(model);

  controller.compute({
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
  });

  test.deepEqual(controller.getComputedValue('displayedMessages'), []);
  test.deepEqual(controller.getComputedValue('likedMessages'), []);

  var signal = [
    function (input, state) {
      state.merge(['data', 'messages'], {
        '123': {title: 'test', liked: true},
        '456': {title: 'test2', liked: true},
        '789': {title: 'test3', liked: false},
        '091': {title: 'test4', liked: false}
      });
      state.set(['lists', 'displayedMessagesIds'], ['123']);
    }
  ];

  controller.signal('test', signal);

  controller.once('signalEnd', function () {

    test.deepEqual(controller.getComputedValue('displayedMessages'), [{
      title: 'test',
      liked: true
    }]);
    test.equal(controller.getComputedValue('likedMessages').length, 2);
    test.done();

  });

  controller.signals.test();

};
