import {Controller} from '..'

export function runCompute (compute, fixtures = {}) {
  let result
  const controller = Controller({
    state: fixtures.state || {},
    signals: {
      test: [
        ({ resolve }) => {
          result = resolve.value(compute) // remove when we have resolve.compute
          // result = resolve.compute(compute, fixtures.props)
        }
      ]
    }
  })
  controller.getSignal('test')(fixtures.input)
  return result
}

export function runAction (action, fixtures = {}) {
  return new Promise((resolve, reject) => {
    let output
    const controller = Controller(Object.assign({}, fixtures, {
      signals: {
        test: [
          (args) => {
            output = action(args)
            return output
          }
        ]
      }
    }))
    controller.getSignal('test')(fixtures.input)
    if (output && output.then) {
      output.then((output) => resolve({output, controller}))
      output.catch((output) => reject({output, controller}))
    } else {
      resolve({output, controller})
    }
  })
}
