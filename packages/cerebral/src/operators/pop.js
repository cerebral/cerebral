export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.pop: You have to use the STATE TAG as first argument')
  }

  function pop ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.pop: You have to use the STATE TAG tag as first argument')
    }

    state.pop(targetTemplate.path)
  }

  pop.displayName = 'operator.pop'

  return pop
}
