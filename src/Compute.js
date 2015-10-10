var utils = require('./utils.js');

module.exports = function (model) {

  var computed = null;

  var createMapper = function(stringPath, cb) {

    var currentState = {};
    var currentValue = null;

    var get = function(path) {
      path = typeof path === 'string' ? [].slice.call(arguments) : path;
      return currentState[path.join('.')] = model.accessors.get(path);
    };

    return function() {

        var isSame = Object.keys(currentState).reduce(function (hasChanged, key) {
          if (hasChanged) {
            return true;
          }
          return model.accessors.get(key.split('.')) === currentState[key];
        }, false);

        if (isSame) {
          return currentValue;
        } else {
          currentState = {};
          return currentValue = cb(get);
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
