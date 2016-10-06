const Path = require('../src/Path')

const createNext = function createNext(next, path) {
  return function (payload) {
    return new Path(path, payload)
  }
}

module.exports = function () {
  return function(context, functionDetails, payload, next) {
    if (functionDetails.outputs) {
      context.path = Object.keys(functionDetails.outputs).reduce(function (output, outputPath) {
        output[outputPath] = createNext(next, outputPath)

        return output
      }, {})
    }

    return context
  }
}
