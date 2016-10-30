import {ensurePath} from '../utils'

function StateProviderFactory () {
  const methods = [
    'get',
    'set',
    'push',
    'merge',
    'pop',
    'shift',
    'unshift',
    'splice',
    'unset',
    'concat',
    'compute'
  ]
  let provider = null

  function createProvider (context) {
    const model = context.controller.model

    return methods.reduce((currentStateContext, methodKey) => {
      if (methodKey === 'compute') {
        currentStateContext.compute = (...args) => model.compute(...args)
      } else if (typeof model[methodKey] === 'function') {
        currentStateContext[methodKey] = (...args) => {
          const path = ensurePath(args.shift())

          return model[methodKey].apply(model, [path].concat(args))
        }
      }

      return currentStateContext
    }, {})
  }

  function StateProvider (context) {
    context.state = provider = provider || createProvider(context)

    if (context.debugger) {
      context.state = methods.reduce((currentState, methodKey) => {
        if (methodKey === 'get' || methodKey === 'compute') {
          currentState[methodKey] = provider[methodKey]
        } else {
          const originFunc = provider[methodKey]

          currentState[methodKey] = (...args) => {
            const argsCopy = args.slice()
            const path = ensurePath(argsCopy.shift())

            context.debugger.send({
              type: 'mutation',
              color: '#333',
              method: methodKey,
              args: [path, ...argsCopy]
            })

            return originFunc.apply(context.controller.model, args)
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
