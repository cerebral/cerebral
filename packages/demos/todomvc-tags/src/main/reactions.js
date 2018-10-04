import ls from 'local-storage'
import { Reaction, state } from 'cerebral'

export const syncTodos = Reaction(
  {
    todos: state`todos`,
  },
  ({ todos }) => ls.set('todos', todos)
)
