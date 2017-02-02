import {Controller} from '..'

export function runCompute(compute, fixtures = {}) {
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
