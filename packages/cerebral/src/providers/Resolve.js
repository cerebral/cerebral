import Tag from '../tags/Tag'
import {Compute} from '../Compute'

function ResolveProviderFactory () {
  function isTag (arg, ...types) {
    if (!(arg instanceof Tag)) {
      return false
    }

    if (types.length) {
      return types.reduce((isType, type) => {
        return isType || type === arg.type
      }, false)
    }

    return true
  }

  function ResolveProvider (context) {
    context.resolve = {
      isTag,
      value (arg) {
        if (arg instanceof Tag || arg instanceof Compute) {
          return arg.getValue({
            state: context.state.get,
            input: context.input,
            signal: context.controller.getSignal.bind(context.controller)
          })
        }

        return arg
      },
      path (arg) {
        if (arg instanceof Tag) {
          return arg.getPath({
            state: context.state.get,
            input: context.input
          })
        }

        throw new Error('You are extracting a path from an argument that is not a Tag')
      }
    }

    return context
  }

  return ResolveProvider
}

export default ResolveProviderFactory
