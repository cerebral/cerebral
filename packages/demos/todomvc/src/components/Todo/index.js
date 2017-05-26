import React from 'react'
import classnames from 'classnames'
import { connect } from 'cerebral/react'
import { state, signal, props } from 'cerebral/tags'

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
  function Todo({
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
        {isEditing &&
          <form
            onSubmit={e => {
              e.preventDefault()
              newTitleSubmitted({ uid })
            }}
          >
            <input
              autoFocus
              className="edit"
              value={isEditing ? todo.editedTitle : todo.title}
              onBlur={() => newTitleSubmitted({ uid })}
              onChange={e => newTitleChanged({ uid, title: e.target.value })}
            />
          </form>}
      </li>
    )
  }
)
