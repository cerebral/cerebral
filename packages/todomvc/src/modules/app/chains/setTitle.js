import {set, input, state} from 'cerebral/operators'

export default [
  set(state`app.newTodoTitle`, input`title`)
]
