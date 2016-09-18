import {ensurePath} from '../utils'

function ModelProviderFactory(model) {
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
  const modelContext = methods.reduce((currentModelContext, methodKey) => {
    if (typeof model[methodKey] === 'function') {
      currentModelContext[methodKey] = (...args) => {
        const path = ensurePath(args.shift())

        return model[methodKey].apply(model, [path].concat(args))
      }
    }

    return currentModelContext
  }, {})

  function ModelProvider(context) {
    context.model = modelContext

    if (context.debugger) {
      context.model = methods.reduce((currentModel, methodKey) => {
        if (methodKey === 'get') {
          currentModel[methodKey] = modelContext[methodKey]
        } else {
          const originFunc = modelContext[methodKey]

          currentModel[methodKey] = () => {
            const args = [].slice.call(arguments)
            const path = ensurePath(args.shift())

            context.debugger.send({
              type: 'mutation',
              color: '#333',
              method: methodKey,
              args: [path, ...args]
            })

            return originFunc.apply(model, arguments)
          }
        }

        return currentModel
      }, {})
    }

    return context
  }

  return ModelProvider
}

export default ModelProviderFactory
