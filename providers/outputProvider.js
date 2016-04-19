var utils = require('../src/utils.js')
var types = require('../src/types.js')

var validateOutput = function (action, path, arg, signalName) {
  if ((!action.options.output && !action.options.outputs) || Array.isArray(action.options.outputs)) {
    return
  }

  var checkers = action.options.output || action.options.outputs[path || action.options.defaultOutput]

  if (checkers === undefined) {
    return
  }

  if (!arg) {
    throw new Error([
      'Cerebral: There is a wrong output of action "' +
      utils.getFunctionName(action) + '" ' +
      'in signal "' + signalName + '". You did not pass any values to the output'
    ].join(''))
  }

  Object.keys(checkers).forEach(function (key) {
    if (!types(checkers[key], arg[key])) {
      throw new Error([
        'Cerebral: There is a wrong output of action "' +
        utils.getFunctionName(action) + '" ' +
        'in signal "' + signalName + '". Check the following prop: "' + key + '"'
      ].join(''))
    }
  })
}

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
        JSON.stringify(Object.keys(action.output || action.outputs))
      ].join(''))
    }

    if (utils.isDeveloping()) {
      validateOutput(action, path, payload, signalName)
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

var addOutputs = function (action, next) {
  if (!action.outputs) {
    next.success = next.bind(null, 'success')
    next.error = next.bind(null, 'error')
  } else if (Array.isArray(action.outputs)) {
    action.outputs.forEach(function (key) {
      next[key] = next.bind(null, key)
    })
  } else {
    Object.keys(action.outputs).forEach(function (key) {
      next[key] = next.bind(null, key)
    })
  }
}

module.exports = function (context, execution) {
  var action = execution.action
  var signalName = execution.signal.name
  var resolve = execution.resolve
  var next = createNextFunction(action, signalName, resolve)
  addOutputs(action, next)

  if (!Boolean(resolve) && utils.isDeveloping()) {
    setTimeout(function () {
      next.hasRun = true
    }, 0)
  }
  context.output = next

  return context
}
