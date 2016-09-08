module.exports = function (extendedContext) {
  return function(context, funcDetails, payload) {
    return Object.keys(extendedContext).reduce(function (context, key) {
      if (context.debugger) {
        var proto = null
        if (
          extendedContext[key].constructor &&
          extendedContext[key].constructor.prototype.constructor !== Object.prototype.constructor &&
          extendedContext[key].constructor.prototype.constructor !== Function.prototype.constructor
        ) {
          proto = extendedContext[key].constructor.prototype
        }

        context[key] = Object.create(extendedContext[key])
        context[key] = Object.keys(extendedContext[key]).reduce(function (obj, objKey) {
          if (typeof extendedContext[key][objKey] === 'function') {
            var originalFunc = extendedContext[key][objKey]

            obj[objKey] = function () {
              context.debugger.send({
                method: key + '.' + objKey,
                color: context.debugger.getColor(key),
                args: [].slice.call(arguments)
              })
              return originalFunc.apply(extendedContext[key], arguments)
            }
          }

          return obj
        }, context[key])

        if (proto) {
          context[key] = Object.getOwnPropertyNames(proto).reduce(function (obj, objKey) {
            if (typeof proto[objKey] === 'function' && objKey !== 'constructor') {
              var originalFunc = proto[objKey]

              obj[objKey] = function () {
                context.debugger.send({
                  method: key + '.' + objKey,
                  color: context.debugger.getColor(key),
                  args: [].slice.call(arguments)
                })
                return originalFunc.apply(extendedContext[key], arguments)
              }
            }

            return obj
          }, context[key])
        }
      } else {
        context[key] = extendedContext[key]
      }

      return context
    }, context)
  }
}
