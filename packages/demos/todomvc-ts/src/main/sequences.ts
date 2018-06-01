import { state, props } from 'app.proxy'
import { sequence, set, unset, toggle, when } from 'cerebral/factories'
import * as actions from './actions'

export const changeFilter = sequence<{ filter: string }>(
  set(state.filter, props.filter)
)

export const changeNewTodoTitle = sequence<{ title: string }>(
  set(state.newTodoTitle, props.title)
)

export const removeTodo = sequence<{ uid: string }>(
  unset(state.todos[props.uid])
)

export const toggleAllChecked = sequence(actions.toggleAllChecked)

export const toggleTodoCompleted = sequence<{ uid: string }>(
  toggle(state.todos[props.uid].completed)
)

export const clearCompletedTodos = sequence(actions.clearCompletedTodos)

export const submitNewTodo = sequence([
  when(state.newTodoTitle),
  {
    true: [actions.addTodo, set(state.newTodoTitle, '')],
    false: [],
  },
])

export const changeTodoTitle = sequence<{ uid: string; title: string }>(
  set(state.todos[props.uid].editedTitle, props.title)
)

export const editTodo = sequence<{ uid: string }>([
  set(state.todos[props.uid].editedTitle, state.todos[props.uid].title),
  set(state.editingUid, props.uid),
])

export const abortEdit = sequence<{ uid: string }>([
  unset(state.todos[props.uid].editedTitle),
  set(state.editingUid, null),
])

export const submitTodoTitle = sequence<{ uid: string }>([
  when(state.todos[props.uid].editedTitle),
  {
    true: [
      set(state.todos[props.uid].title, state.todos[props.uid].editedTitle),
      unset(state.todos[props.uid].editedTitle),
      set(state.editingUid, null),
    ],
    false: [],
  },
])
