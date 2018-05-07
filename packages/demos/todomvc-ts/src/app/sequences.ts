// @ts-ignore
import { redirect } from '@cerebral/router/operators'
import { state, sequence, sequenceWithProps } from 'cerebral.proxy'
import * as actions from './actions'

export const redirectToAll = sequence((s) => s.action(redirect('/all')))

export const changeNewTodoTitle = sequenceWithProps<{ title: string }>((s) =>
  s.action(({ operators, props }) =>
    operators.set(state.newTodoTitle, props.title)
  )
)

export const removeTodo = sequenceWithProps<{ uid: string }>((s) =>
  s.action(({ operators, props }) => operators.unset(state.todos[props.uid]))
)

export const toggleAllChecked = sequence((s) =>
  s.action(actions.toggleAllChecked)
)

export const toggleTodoCompleted = sequenceWithProps<{ uid: string }>((s) =>
  s.action(({ operators, props }) =>
    operators.toggle(state.todos[props.uid].completed)
  )
)

export const clearCompletedTodos = sequence((s) =>
  s.action(actions.clearCompletedTodos)
)

export const changeFilter = sequenceWithProps<{ filter: string }>((s) =>
  s.action(({ operators, props }) => operators.set(state.filter, props.filter))
)

export const submitNewTodo = sequence((s) =>
  s.when(({ get }) => Boolean(get(state.newTodoTitle))).paths({
    true: (s) =>
      s
        .action(actions.addTodo)
        .action(({ operators }) => operators.set(state.newTodoTitle, '')),
    false: (s) => s,
  })
)

export const changeTodoTitle = sequenceWithProps<{
  uid: string
  title: string
}>((s) =>
  s.action(({ operators, props }) =>
    operators.set(state.todos[props.uid].editedTitle, props.title)
  )
)

export const editTodo = sequenceWithProps<{ uid: string }>((s) =>
  s
    .action(({ operators, props }) =>
      operators.set(
        state.todos[props.uid].editedTitle,
        state.todos[props.uid].title
      )
    )
    .action(({ operators, props }) =>
      operators.set(state.editingUid, props.uid)
    )
)

export const abortEdit = sequenceWithProps<{ uid: string }>((s) =>
  s
    .action(({ operators, props }) =>
      operators.unset(state.todos[props.uid].editedTitle)
    )
    .action(({ operators }) => operators.set(state.editingUid, null))
)

export const submitTodoTitle = sequenceWithProps<{ uid: string }>((s) =>
  s
    .when(({ get, props }) => Boolean(get(state.todos[props.uid].editedTitle)))
    .paths({
      true: (s) =>
        s
          .action(({ operators, props }) =>
            operators.set(
              state.todos[props.uid].title,
              state.todos[props.uid].editedTitle
            )
          )
          .action(({ operators, props }) =>
            operators.unset(state.todos[props.uid].editedTitle)
          )
          .action(({ operators }) => operators.set(state.editingUid, null)),
      false: (s) => s,
    })
)
