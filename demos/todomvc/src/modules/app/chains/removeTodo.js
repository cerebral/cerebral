import {unset} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'

export default [
  unset(state`app.todos.${props`ref`}`)
]
