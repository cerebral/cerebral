var utils = require('./utils.js');

module.exports = function (model) {

  var registered = [];
  var computed = [];

  var createMapper = function(cb) {

    var initialRun = true;
    var currentState = {};
    var currentValue;

    var get = function(path) {
      if (typeof path === 'function') {
        return currentState['COMPUTED_' + registered.indexOf(path)] = getComputedValue(path);
      } else {
        return currentState[path.join('.%.')] = model.accessors.get(path);
      }
    };

    return function() {

        var hasChanged = Object.keys(currentState).reduce(function (hasChanged, key) {
          if (hasChanged) {
            return true;
          }
          if (key.indexOf('COMPUTED') === 0) {
            return getComputedValue(registered[key.split('_')[1]]) !== currentState[key];
          } else {
            return model.accessors.get(key.split('.%.')) !== currentState[key];
          }

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

  var has = function (computedFunc) {
    return registered.indexOf(computedFunc) !== -1;
  };

  var getComputedValue = function (computedFunc) {
    if (!has(computedFunc)) {
      registered.push(computedFunc);
      computed.push(createMapper(computedFunc));
    }

    return computed[registered.indexOf(computedFunc)]();
  };

  return {
    register: function (computeFunc) {
      registered.push(computeFunc);
      computed.push(createMapper(computeFunc));
      return this.getComputedValue(computeFunc);
    },
    has: has,
    getComputedValue: getComputedValue
  };

};
