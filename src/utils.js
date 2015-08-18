module.exports = {
  getFunctionName: function(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
  },
  merge: function (target, source) {
    source = source || {};
    return Object.keys(source).reduce(function (target, key) {
      target[key] = source[key];
      return target;
    }, target);
  },
  hasLocalStorage: function() {
    return typeof global.localStorage !== 'undefined';
  },
  isPathObject: function (obj) {
    return (
      obj && (obj.resolve || obj.reject)
    );
  },
  debounce: function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
  isAction: function (action) {
    return typeof action === 'function';
  },
  isDeveloping: function () {
    return !global.process || global.process.env !== 'production';
  }
};
