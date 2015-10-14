var utils = require('./utils.js');

module.exports = function (model) {

  var computed = null;

  var getComputedValue = function (path) {
    if (!computed) {
      return;
    }

    if (typeof path === 'string') {
      path = path.split('.');
    } else {
      path = path.slice();
    }
    var level = computed;
    var key = path.pop();
    while(path.length) {
      level = level[path.shift()];
    }

    if (typeof level[key] !== 'function') {
      throw new Error('CEREBRAL Computed - You are not passing a correct path to a computed');
    }

    return level[key]();
  };

  var createMapper = function(stringPath, cb) {

    var initialRun = true;
    var currentState = {};
    var currentComputedState = {};
    var currentValue;

    var get = function(path) {
      return currentState[path.join('.')] = model.accessors.get(path);
    };

    var getComputed = function (path) {
      return currentComputedState[path.join('.')] = getComputedValue(path);
    }

    return function() {

        var hasChanged = Object.keys(currentState).reduce(function (hasChanged, key) {
          if (hasChanged) {
            return true;
          }
          return model.accessors.get(key.split('.')) !== currentState[key];
        }, false);

        var hasChangedComputed = Object.keys(currentComputedState).reduce(function (hasChanged, key) {
          if (hasChanged) {
            return true;
          }
          return getComputedValue(key.split('.')) !== currentComputedState[key];
        }, false);


        if (hasChanged || hasChangedComputed || initialRun) {
          currentState = {};
          currentComputedState = {};
          initialRun = false;
          return currentValue = cb(get, getComputed);
        } else {
          return currentValue;
        }
    };
  };

  return {
    register: function (computeTree) {
        var path = [];
        var traverse = function (tree, level) {
          return Object.keys(tree).reduce(function (computed, key) {
            if (typeof tree[key] === 'function') {
              computed[key] = createMapper(key, tree[key]);
            } else {
              computed[key] = traverse(tree[key], {});
            }
            return computed;
          }, level);
        };
        computed = traverse(computeTree, {});
    },
    getComputedValue: getComputedValue,
    getComputedPaths: function () {
      var path = [];
      var paths = [];

      if (!computed) {
        return paths;
      }

      var traverse = function (tree) {
        return Object.keys(tree).forEach(function (key) {
          path.push(key);
          if (typeof tree[key] === 'function') {
            paths.push(path.join('.'));
          } else {
            traverse(tree[key]);
          }
          path.pop();
          return paths;
        });
      };
      traverse(computed, []);
      return paths;
    }
  };

};
