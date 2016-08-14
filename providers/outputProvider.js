var utils = require('../src/utils.js')

var createNextFunction = function (action, signalName, resolver) {
  var next = function () {
    if (next.hasRun) {
      throw new Error('Cerebral - You are running an async output on a synchronous action in ' + signalName + '. The action is ' + action.name + '. Either put it in an array or make sure the output is synchronous')
    }

    var path = typeof arguments[0] === 'string' ? arguments[0] : null
    var payload = path ? arguments[1] : arguments[0]

    // Test payload
    if (utils.isDeveloping()) {
      try {
        JSON.stringify(payload)
      } catch (e) {
        console.log('Not serializable', payload)
        throw new Error('Cerebral - Could not serialize output. Please check signal ' + signalName + ' and action ' + action.name)
      }
    }

    if (!path && !action.options.defaultOutput && action.options.outputs) {
      throw new Error([
        'Cerebral: There is a wrong output of action "' +
        utils.getFunctionName(action) + '" ' +
        'in signal "' + signalName + '". Set defaultOutput or use one of outputs ' +
        JSON.stringify(Object.keys(action.output || action.outputs || {}))
      ].join(''))
    }

    // This is where I verify path and types
    var result = {
      path: path || action.options.defaultOutput,
      payload: payload || {}
    }
    resolver(result)
  }
  return next
}

module.exports = function (context, execution) {
  var action = execution.action
  var signalName = execution.signal.name
  var resolve = execution.resolve
  var next = createNextFunction(action, signalName, resolve)
  if (action.outputs) {
    Object.keys(action.outputs).forEach(function (key) {
      next[key] = next.bind(null, key)
    })
  }

  if (!resolve && utils.isDeveloping()) {
    setTimeout(function () {
      next.hasRun = true
    }, 0)
  }
  context.output = next

  return context
}
