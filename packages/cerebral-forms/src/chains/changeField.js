import validateField from '../factories/validateField'

export default [
  function updateValue ({input, state}) {
    state.set(`${input.field}.value`, input.value)
  },
  validateField()
]
