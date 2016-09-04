function createNext(next, path) {
  return function (payload) {
    return {
      path,
      payload
    }
  }
}

module.exports = function () {
  return function(context, functionDetails, payload, next) {
    if (functionDetails.outputs) {
      context.result = Object.keys(functionDetails.outputs).reduce(function (output, outputPath) {
        output[outputPath] = createNext(next, outputPath)

        return output
      }, {})
    } else {
      context.result = createNext(next)
    }

    return context
  }
}
