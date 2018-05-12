import React from 'react'
import classnames from 'classnames'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/proxy'

export default connect(function Todo({ uid, isEditing, get }) {
  const todo = get(state.todos[uid])
  const todoDoubleClicked = get(signal.todoDoubleClicked)
  const newTitleChanged = get(signal.todoNewTitleChanged)
  const newTitleSubmitted = get(signal.todoNewTitleSubmitted)
  const toggleCompletedChanged = get(signal.toggleTodoCompletedChanged)
  const removeTodoClicked = get(signal.removeTodoClicked)

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
