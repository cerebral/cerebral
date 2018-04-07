import { redirect } from '@cerebral/router/operators'
import { path, sequence, sequenceWithProps } from 'fluent'
import * as actions from './actions'

export const redirectToAll = sequence((s) => s.action(redirect('/all')))

export const changeNewTodoTitle = sequenceWithProps<{ title: string }>((s) =>
  s.action(({ state, props }) => state.set(path.newTodoTitle, props.title))
)

export const removeTodo = sequenceWithProps<{ uid: string }>((s) =>
  s.action(({ state, props }) => state.unset(path.todos[props.uid]))
)

export const toggleAllChecked = sequence((s) =>
  s.action(actions.toggleAllChecked)
)

export const toggleTodoCompleted = sequenceWithProps<{ uid: string }>((s) =>
  s.action(({ state, props }) => state.toggle(path.todos[props.uid].completed))
)

export const clearCompletedTodos = sequence((s) =>
  s.action(actions.clearCompletedTodos)
)

export const changeFilter = sequenceWithProps<{ filter: string }>((s) =>
  s.action(({ state, props }) => state.set(path.filter, props.filter))
)

export const submitNewTodo = sequence((s) =>
  s.when(({ state }) => Boolean(state.get(path.newTodoTitle))).paths({
    true: (s) =>
      s
        .action(actions.addTodo)
        .action(({ state }) => state.set(path.newTodoTitle, '')),
    false: (s) => s,
  })
)

export const changeTodoTitle = sequenceWithProps<{
  uid: string
  title: string
}>((s) =>
  s.action(({ state, props }) =>
    state.set(path.todos[props.uid].editedTitle, props.title)
  )
)

export const editTodo = sequenceWithProps<{ uid: string }>((s) =>
  s
    .action(({ state, props }) =>
      state.set(path.todos[props.uid].editedTitle, path.todos[props.uid].title)
    )
    .action(({ state, props }) => state.set(path.editingUid, props.uid))
)

export const abortEdit = sequenceWithProps<{ uid: string }>((s) =>
  s
    .action(({ state, props }) =>
      state.unset(path.todos[props.uid].editedTitle)
    )
    .action(({ state }) => state.set(path.editingUid, null))
)

export const submitTodoTitle = sequenceWithProps<{ uid: string }>((s) =>
  s
    .when(({ state, props }) =>
      Boolean(state.get(path.todos[props.uid].editedTitle))
    )
    .paths({
      true: (s) =>
        s
          .action(({ state, props }) =>
            state.set(
              path.todos[props.uid].title,
              path.todos[props.uid].editedTitle
            )
          )
          .action(({ state, props }) =>
            state.unset(path.todos[props.uid].editedTitle)
          )
          .action(({ state }) => state.set(path.editingUid, null)),
      false: (s) => s,
    })
)
