// @ts-ignore
import ls from 'local-storage'
import { Reaction } from 'cerebral'
import { state } from 'app.proxy'

export const syncTodos = Reaction(
  {
    todos: state.todos,
  },
  ({ todos }) => ls.set('todos', todos)
)
