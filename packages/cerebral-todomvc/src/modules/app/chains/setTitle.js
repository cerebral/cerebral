import {copy} from 'cerebral/operators'

export default [
  copy('input:title', 'state:app.newTodoTitle')
]
