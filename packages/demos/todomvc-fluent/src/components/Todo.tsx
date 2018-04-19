import * as classnames from 'classnames'
import * as React from 'react'
import { connect } from '../fluent'

export default connect<{ uid: string; isEditing: boolean }>()
  .with(({ state, props, signals }) => {
    const todo = state.todos.get(props.uid) || {
      completed: false,
      editedTitle: '',
      title: '',
    }

    return {
      todo: {
        completed: todo.completed,
        editedTitle: todo.editedTitle,
        title: todo.title,
      },
      newTitleAborted: signals.abortEdit,
      newTitleChanged: signals.changeTodoTitle,
      newTitleSubmitted: signals.submitTodoTitle,
      removeTodoClicked: signals.removeTodo,
      todoDoubleClicked: signals.editTodo,
      toggleCompletedChanged: signals.toggleTodoCompleted,
    }
  })
  .to(function Todo({
    uid,
    isEditing,
    todo,
    todoDoubleClicked,
    newTitleChanged,
    newTitleSubmitted,
    toggleCompletedChanged,
    removeTodoClicked,
    newTitleAborted,
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
            onChange={() => toggleCompletedChanged({ uid })}
            checked={todo.completed}
          />
          <label onDoubleClick={() => todoDoubleClicked({ uid })}>
            {todo.title}
          </label>
          <button
            className="destroy"
            onClick={() => removeTodoClicked({ uid })}
          />
        </div>
        {isEditing && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              newTitleSubmitted({ uid })
            }}
          >
            <input
              autoFocus
              className="edit"
              value={isEditing ? todo.editedTitle : todo.title}
              onBlur={() => newTitleSubmitted({ uid })}
              onChange={(e) => newTitleChanged({ uid, title: e.target.value })}
            />
          </form>
        )}
      </li>
    )
  })

/*
export default connect(
  {
    todo: state`todos.${props`uid`}`,
    todoDoubleClicked: signal`todoDoubleClicked`,
    newTitleChanged: signal`todoNewTitleChanged`,
    newTitleSubmitted: signal`todoNewTitleSubmitted`,
    toggleCompletedChanged: signal`toggleTodoCompletedChanged`,
    removeTodoClicked: signal`removeTodoClicked`,
    newTitleAborted: signal`todoNewTitleAborted`,
  },

)
*/
