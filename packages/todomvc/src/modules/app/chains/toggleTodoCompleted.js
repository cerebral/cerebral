import {input, state, toggle} from 'cerebral/operators'

export default [
  toggle(state`app.todos.${input`ref`}.completed`)
]
