import Path from '../Path'

function createNext (next, path) {
  return function (payload) {
    return new Path(path, payload)
  }
}

export default function PathProvider () {
  return (context, functionDetails, payload, next) => {
    if (functionDetails.outputs) {
      context.path = Object.keys(functionDetails.outputs).reduce((output, outputPath) => {
        output[outputPath] = createNext(next, outputPath)

        return output
      }, {})
    }

    return context
  }
}
