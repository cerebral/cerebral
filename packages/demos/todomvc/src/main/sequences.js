import { props, state } from 'cerebral'
import { set, toggle, unset, when } from 'cerebral/factories'
import * as actions from './actions'

export const changeNewTodoTitle = set(state.newTodoTitle, props.title)

export const removeTodo = unset(state.todos[props.uid])

export const toggleAllChecked = actions.toggleAllChecked

export const toggleTodoCompleted = toggle(state.todos[props.uid].completed)

export const clearCompletedTodos = actions.clearCompletedTodos

export const changeFilter = set(state.filter, props.filter)

export const submitNewTodo = [
  when(state.newTodoTitle),
  {
    true: [actions.addTodo, set(state.newTodoTitle, '')],
    false: [],
  },
]

export const changeTodoTitle = set(
  state.todos[props.uid].editedTitle,
  props.title
)

export const editTodo = [
  set(state.todos[props.uid].editedTitle, state.todos[props.uid].title),
  set(state.editingUid, props.uid),
]

export const abortEdit = [
  unset(state.todos[props.uid].editedTitle),
  set(state.editingUid, null),
]

export const submitTodoTitle = [
  when(state.todos[props.uid].editedTitle),
  {
    true: [
      set(state.todos[props.uid].title, state.todos[props.uid].editedTitle),
      unset(state.todos[props.uid].editedTitle),
      set(state.editingUid, null),
    ],
    false: [],
  },
]
