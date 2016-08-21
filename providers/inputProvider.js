var utils = require('../src/utils')

module.exports = function (context, execution) {
  var action = execution.action
  var signal = execution.signal
  var inputs = [
    {},
    execution.payload,
    action.options.defaultInput ? action.options.defaultInput : {}
  ]

  if (
    utils.isDeveloping() &&
    execution.payload &&
    (
      typeof execution.payload !== 'object' ||
      (
        typeof execution.payload === 'object' &&
        execution.payload !== null &&
        !Array.isArray(execution.payload) &&
        execution.payload.constructor.name !== 'Object'
      )
    )
  ) {
    console.warn('Cerebral - You passed an invalid signal payload to signal "' + signal.name + '", it has to be a plain object or nothing. This is the payload: ', execution.payload)
  }

  context.input = utils.merge.apply(null, inputs)

  return context
}
