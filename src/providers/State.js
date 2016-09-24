import {ensurePath} from '../utils'

function StateProviderFactory(model) {
  const methods = [
    'get',
    'set',
    'push',
    'merge',
    'pop',
    'shift',
    'unshift',
    'splice',
    'unset'
  ]
  const stateContext = methods.reduce((currentStateContext, methodKey) => {
    if (typeof model[methodKey] === 'function') {
      currentStateContext[methodKey] = (...args) => {
        const path = ensurePath(args.shift())

        return model[methodKey].apply(model, [path].concat(args))
      }
    }

    return currentStateContext
  }, {})

  function StateProvider(context) {
    context.state = stateContext

    if (context.debugger) {
      context.state = methods.reduce((currentState, methodKey) => {
        if (methodKey === 'get') {
          currentState[methodKey] = stateContext[methodKey]
        } else {
          const originFunc = stateContext[methodKey]

          currentState[methodKey] = (...args) => {
            const argsCopy = args.slice()
            const path = ensurePath(argsCopy.shift())

            context.debugger.send({
              type: 'mutation',
              color: '#333',
              method: methodKey,
              args: [path, ...argsCopy]
            })

            return originFunc.apply(model, args)
          }
        }

        return currentState
      }, {})
    }

    return context
  }

  return StateProvider
}

export default StateProviderFactory
