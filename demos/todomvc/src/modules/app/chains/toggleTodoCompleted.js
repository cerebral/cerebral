import {toggle} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'

export default [
  toggle(state`app.todos.${props`ref`}.completed`)
]
