import { sequence, sequenceWithProps } from '../fluent'
import * as actions from './actions'

export const redirectToAll = sequence((s) => s.action(actions.redirectToAll))

export const changeNewTodoTitle = sequenceWithProps<{ title: string }>((s) =>
  s.action(actions.changeNewTodoTitle)
)

export const removeTodo = sequenceWithProps<{ uid: string }>((s) =>
  s.action(actions.removeTodo)
)

export const toggleAllChecked = sequence((s) =>
  s.action(actions.toggleAllChecked)
)

export const toggleTodoCompleted = sequenceWithProps<{ uid: string }>((s) =>
  s.action(actions.toggleTodoCompleted)
)

export const clearCompletedTodos = sequence((s) =>
  s.action(actions.clearCompletedTodos)
)

export const changeFilter = sequenceWithProps<{ filter: string }>((s) =>
  s.action(actions.changeFilter)
)

export const submitNewTodo = sequence((s) =>
  s.when((x) => !!x.state.newTodoTitle).paths({
    true: (s) => s.action(actions.addTodo, actions.clearTodoTitle),
    false: (s) => s,
  })
)

export const changeTodoTitle = sequenceWithProps<{
  uid: string
  title: string
}>((s) => s.action(actions.changeTodoTitle))

export const editTodo = sequenceWithProps<{ uid: string }>((s) =>
  s.action(actions.editTodo)
)

export const abortEdit = sequenceWithProps<{ uid: string }>((s) =>
  s.action(actions.abortEditingTodo)
)

export const submitTodoTitle = sequenceWithProps<{ uid: string }>((s) =>
  s.branch(actions.whenEditedTitle).paths({
    true: (s) => s.action(actions.updateTodoTitle),
    false: (s) => s,
  })
)
