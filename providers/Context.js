module.exports = function (extendedContext) {
  return function(context, funcDetails, payload) {
    return Object.keys(extendedContext).reduce(function (context, key) {
      if (context.debugger) {
        context[key] = Object.keys(extendedContext[key]).reduce(function (obj, objKey) {
          var originalFunc = extendedContext[key][objKey]

          obj[objKey] = function () {
            context.debugger.send({
              method: key + '.' + objKey,
              color: context.debugger.getColor(key),
              args: [].slice.call(arguments)
            })
            return originalFunc.apply(extendedContext[key], arguments)
          }
          return obj
        }, {})
      } else {
        context[key] = extendedContext[key]
      }

      return context
    }, context)
  }
}
