export const MODULE = 'cerebral-module-useragent'

export function addContext (module, context) {
  if (module.addContextProvider) {
    module.addContextProvider({
      [MODULE]: context
    })
  }
}

export function getSpecs (context) {
  const {input, state, services} = context

  let module = context[MODULE] || context.module
  let options = module.options || module.meta.options
  let path = options.path || module.path

  return {
    input,
    state,
    services,
    module,
    options,
    path
  }
}

export default {
  addContext,
  getSpecs
}
