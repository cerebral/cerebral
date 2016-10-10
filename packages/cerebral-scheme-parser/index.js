module.exports = function (path) {
  var targetMatch = path.match(/(^.*?):/)
  var valueMatch = path.match(/:(.*)/)
  var value = valueMatch ? valueMatch[1] : path
  var inlineSchemes = value.match(/({{.+?}})/g)
  var schemes = (inlineSchemes || []).map(function (inlineScheme) {
    var inlineSchemeSanitizied = inlineScheme.replace(/[{}]/g, '')
    var targetMatch = inlineSchemeSanitizied.match(/(^.*):/)
    var valueMatch = inlineSchemeSanitizied.match(/:(.*)/)
    return {
      target: targetMatch ? targetMatch[1] : null,
      value: valueMatch ? valueMatch[1] : inlineScheme
    }
  })

  return {
    target: targetMatch ? targetMatch[1] : null,
    value: value,
    schemes: schemes,
    getValue: function (cb) {
      return schemes.reduce(function (schemedValue, scheme, index) {
        return schemedValue.replace(inlineSchemes[index], cb(scheme))
      }, value)
    },
    getValuePromise: function (cb) {
      return schemes.reduce(function (schemedValuePromise, scheme, index) {
        var newValue = null
        return schemedValuePromise.then(function (value) {
          newValue = value
          return cb(scheme)
        })
        .then(function (schemeValue) {
          return newValue.replace(inlineSchemes[index], schemeValue)
        })
      }, new Promise(function (resolve) { resolve(value) }))
    }
  }
}
