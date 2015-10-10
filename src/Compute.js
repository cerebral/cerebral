var utils = require('./utils.js');

module.exports = function (model) {

  var computed = null;

  var createMapper = function(stringPath, cb) {

    var initialRun = true;
    var currentState = {};
    var currentValue;

    var get = function(path) {
      path = typeof path === 'string' ? [].slice.call(arguments) : path;
      return currentState[path.join('.')] = model.accessors.get(path);
    };

    return function() {

        var hasChanged = Object.keys(currentState).reduce(function (hasChanged, key) {
          if (hasChanged) {
            return true;
          }
          return model.accessors.get(key.split('.')) !== currentState[key];
        }, false);


        if (hasChanged || initialRun) {
          currentState = {};
          initialRun = false;
          return currentValue = cb(get);
        } else {
          return currentValue;
        }
    };
  };

  return {
    register: function (computeTree) {
        computed =  Object.keys(computeTree).reduce(function (computed, key) {
          computed[key] = createMapper(key, computeTree[key]);
          return computed;
        }, {});
    },
    getComputedValue: function (name) {
      if (!computed) {
        return;
      }
      var compute = computed[name];
      return compute ? compute() : undefined;
    },
    getComputedPaths: function () {
      return Object.keys(computed || {});
    }
  };

};
