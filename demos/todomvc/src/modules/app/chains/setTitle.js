import {set} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'

export default [
  set(state`app.newTodoTitle`, props`title`)
]
