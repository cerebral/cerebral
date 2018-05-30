import * as React from 'react'
import classnames from 'classnames'
import { connect } from '@cerebral/react'
import { state, sequences, props } from 'cerebral.proxy'

type ExternalProps = {
  uid: string
  isEditing: boolean
}

const deps = {
  todo: state.todos[props.uid],
  todoDoubleClicked: sequences.editTodo,
  changeTodoTitle: sequences.changeTodoTitle,
  submitTodoTitle: sequences.submitTodoTitle,
  toggleTodoCompleted: sequences.toggleTodoCompleted,
  removeTodo: sequences.removeTodo,
  abortEdit: sequences.abortEdit,
}

export default connect<ExternalProps, typeof deps>(
  deps,
  function Todo({
    uid,
    isEditing,
    todo,
    todoDoubleClicked,
    changeTodoTitle,
    submitTodoTitle,
    toggleTodoCompleted,
    removeTodo,
    abortEdit,
  }) {
    return (
      <li
        className={classnames({
          completed: todo.completed,
          editing: isEditing,
        })}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            onChange={() => toggleTodoCompleted({ uid })}
            checked={todo.completed}
          />
          <label onDoubleClick={() => todoDoubleClicked({ uid })}>
            {todo.title}
          </label>
          <button className="destroy" onClick={() => removeTodo({ uid })} />
        </div>
        {isEditing && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitTodoTitle({ uid })
            }}
          >
            <input
              autoFocus
              className="edit"
              value={isEditing ? todo.editedTitle : todo.title}
              onBlur={() => submitTodoTitle({ uid })}
              onChange={(e) => changeTodoTitle({ uid, title: e.target.value })}
            />
          </form>
        )}
      </li>
    )
  }
)
