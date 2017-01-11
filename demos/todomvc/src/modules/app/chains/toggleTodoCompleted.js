import {toggle} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'

export default [
  toggle(state`app.todos.${input`ref`}.completed`)
]
