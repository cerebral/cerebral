import React from 'react'
import classnames from 'classnames'
import { connect } from '@cerebral/react'
import { state, signals } from 'cerebral/proxy'

export default connect(function Todo({ uid, isEditing, get }) {
  const todo = get(state.todos[uid])
  const todoDoubleClicked = get(signals.todoDoubleClicked)
  const newTitleChanged = get(signals.todoNewTitleChanged)
  const newTitleSubmitted = get(signals.todoNewTitleSubmitted)
  const toggleCompletedChanged = get(signals.toggleTodoCompletedChanged)
  const removeTodoClicked = get(signals.removeTodoClicked)

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
