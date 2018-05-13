import * as React from 'react'
import classnames from 'classnames'
import { connect } from '@cerebral/react'
import { state, signals, props } from 'cerebral.proxy'

type ExternalProps = {
  uid: string
  isEditing: boolean
}

const deps = {
  todo: state.todos[props.uid],
  todoDoubleClicked: signals.editTodo,
  newTitleChanged: signals.changeTodoTitle,
  newTitleSubmitted: signals.submitTodoTitle,
  toggleCompletedChanged: signals.toggleTodoCompleted,
  removeTodoClicked: signals.removeTodo,
  newTitleAborted: signals.abortEdit,
}

export default connect<ExternalProps, typeof deps>(deps, function Todo({
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
