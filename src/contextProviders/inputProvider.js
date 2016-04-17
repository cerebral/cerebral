var utils = require('../utils')

module.exports = function (context, execution) {
  var action = execution.action
  var signal = execution.signal

  context.input = action.options.defaultInput ? utils.merge({}, action.options.defaultInput, execution.input) : execution.input

  if (utils.isDeveloping() && action.options.input) {
    utils.verifyInput(action.name, signal.name, action.options.input, context.input)
  }

  return context
}
