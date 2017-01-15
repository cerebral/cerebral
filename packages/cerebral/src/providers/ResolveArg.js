import Tag from '../tags/Tag'

function ResolveArgProviderFactory () {
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

  function ResolveArgProvider (context) {
    context.resolveArg = {
      isTag,
      value (arg) {
        if (arg instanceof Tag) {
          return arg.getValue({
            state: context.state.get,
            input: context.input,
            signal: context.controller.getSignal.bind(context.controller)
          })
        } else if (typeof arg === 'function') {
          return arg(context)
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

  return ResolveArgProvider
}

export default ResolveArgProviderFactory
