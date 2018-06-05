import React from 'react'
import classnames from 'classnames'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

function Todo({ uid, isEditing, get }) {
  const todo = get(state.todos[uid])
  const todoDoubleClicked = get(sequences.editTodo)
  const changeTodoTitle = get(sequences.changeTodoTitle)
  const submitTodoTitle = get(sequences.submitTodoTitle)
  const toggleTodoCompleted = get(sequences.toggleTodoCompleted)
  const removeTodo = get(sequences.removeTodo)

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

export default connect(Todo)
