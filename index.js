module.exports = function(path) {
  var value = path.match(/:(.*)/)[1];
  var inlineSchemes = value.match(/({{.+?}})/g);
  var schemes = (inlineSchemes || []).map(function(inlineScheme) {
    var inlineSchemeSanitizied = inlineScheme.replace(/[{}]/g, '');

    return {
      target: inlineSchemeSanitizied.match(/(^.*):/)[1],
      value: inlineSchemeSanitizied.match(/:(.*)/)[1]
    };
  });

  return {
    target: path.match(/(^.*):/)[1],
    value: value,
    schemes: schemes,
    getValue: function(cb) {
      return schemes.reduce(function(schemedValue, scheme, index) {
        return schemedValue.replace(inlineSchemes[index], cb(scheme));
      }, value);
    },
    getValuePromise: function(cb) {
      return schemes.reduce(function(schemedValuePromise, scheme, index) {
        var newValue = null;
        return schemedValuePromise.then(function(value) {
          newValue = value;
          return cb(scheme);
        })
        .then(function(schemeValue) {
          return newValue.replace(inlineSchemes[index], schemeValue);
        })
      }, new Promise(function(resolve) {resolve(value)}));
    }
  };
};
