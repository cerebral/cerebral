// @ts-ignore
import { redirect } from '@cerebral/router/factories'
import { state, Sequence, SequenceWithProps } from 'cerebral.proxy'
import * as actions from './actions'

export const redirectToAll = Sequence((s) => s.action(redirect('/all')))

export const changeNewTodoTitle = SequenceWithProps<{ title: string }>((s) =>
  s.action(({ operators, props }) =>
    operators.set(state.newTodoTitle, props.title)
  )
)

export const removeTodo = SequenceWithProps<{ uid: string }>((s) =>
  s.action(({ operators, props }) => operators.unset(state.todos[props.uid]))
)

export const toggleAllChecked = Sequence((s) =>
  s.action(actions.toggleAllChecked)
)

export const toggleTodoCompleted = SequenceWithProps<{ uid: string }>((s) =>
  s.action(({ operators, props }) =>
    operators.toggle(state.todos[props.uid].completed)
  )
)

export const clearCompletedTodos = Sequence((s) =>
  s.action(actions.clearCompletedTodos)
)

export const changeFilter = SequenceWithProps<{ filter: string }>((s) =>
  s.action(({ operators, props }) => operators.set(state.filter, props.filter))
)

export const submitNewTodo = Sequence((s) =>
  s.when(({ get }) => Boolean(get(state.newTodoTitle))).paths({
    true: (s) =>
      s
        .action(actions.addTodo)
        .action(({ operators }) => operators.set(state.newTodoTitle, '')),
    false: (s) => s,
  })
)

export const changeTodoTitle = SequenceWithProps<{
  uid: string
  title: string
}>((s) =>
  s.action(({ operators, props }) =>
    operators.set(state.todos[props.uid].editedTitle, props.title)
  )
)

export const editTodo = SequenceWithProps<{ uid: string }>((s) =>
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

export const abortEdit = SequenceWithProps<{ uid: string }>((s) =>
  s
    .action(({ operators, props }) =>
      operators.unset(state.todos[props.uid].editedTitle)
    )
    .action(({ operators }) => operators.set(state.editingUid, null))
)

export const submitTodoTitle = SequenceWithProps<{ uid: string }>((s) =>
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
