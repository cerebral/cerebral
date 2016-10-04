import validateField from './validateField'

export default [
  function touchField ({input, state}) {
    state.set(`${input.field}.isPristine`, false)
  },
  function updateValue ({input, state}) {
    state.set(`${input.field}.value`, input.value)
  },
  validateField()
]
