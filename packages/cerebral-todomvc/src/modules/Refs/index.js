export default (options = {}) => {
  return (module) => {
    module.alias('cerebral-module-refs')

    module.addState({
      nextRef: 0
    })

    module.addServices({
      next (state) {
        const nextId = state.get([module.name, 'nextRef'].join('.'))
        state.set([module.name, 'nextRef'].join('.'), nextId + 1)
        return nextId
      }
    })
  }
}
