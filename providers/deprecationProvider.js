module.exports = function (context, execution, controller) {
  if (!context.module && !context.modules) {
    Object.defineProperty(context, 'module', {
      get: function () {
        throw new Error('DEPRECATED: Use of "module" in signal "' + execution.signal.name + '" and action "' + execution.action.name + '" is no longer supported. Please install: https://github.com/cerebral/cerebral-provider-modules to get some more juice!')
      }
    })

    Object.defineProperty(context, 'modules', {
      get: function () {
        throw new Error('DEPRECATED: Use of "modules" in signal "' + execution.signal.name + '" and action "' + execution.action.name + '" is no longer supported. Please install: https://github.com/cerebral/cerebral-provider-modules to get some more juice!')
      }
    })
  }

  return context
}
