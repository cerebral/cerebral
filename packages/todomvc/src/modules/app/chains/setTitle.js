import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'

export default [
  set(state`app.newTodoTitle`, input`title`)
]
