import {createResolver} from '../utils'

function ResolveProviderFactory () {
  function ResolveProvider (context) {
    context.resolve = createResolver({
      state: context.state.get,
      input: context.input,
      signal: context.controller.getSignal.bind(context.controller)
    })

    return context
  }

  return ResolveProvider
}

export default ResolveProviderFactory
