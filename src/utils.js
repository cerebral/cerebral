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
  }
};
