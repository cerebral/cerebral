import {input, state, unset} from 'cerebral/operators'

export default [
  unset(state`app.todos.${input`ref`}`)
]
