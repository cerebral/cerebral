import React from 'react'
import cn from 'classnames'
import { connect } from 'cerebral/react'
import {state, signal, props} from 'cerebral/tags'

export default connect({
  todo: state`app.todos.${props`todoRef`}`,
  todoDoubleClicked: signal`app.todoDoubleClicked`,
  newTitleChanged: signal`app.todoNewTitleChanged`,
  newTitleSubmitted: signal`app.todoNewTitleSubmitted`,
  toggleCompletedChanged: signal`app.toggleTodoCompletedChanged`,
  removeTodoClicked: signal`app.removeTodoClicked`,
  newTitleAborted: signal`app.todoNewTitleAborted`
},
  function Todo ({
    todoRef,
    todo: { completed, $isEditing, $isSaving, title, $newTitle },
    todoDoubleClicked,
    newTitleChanged,
    newTitleSubmitted,
    toggleCompletedChanged,
    removeTodoClicked,
    newTitleAborted
  }) {
    return (
      <li className={cn({ completed, editing: $isEditing })}>
        <div className='view'>
          {
            $isSaving || (
              <input
                className='toggle'
                type='checkbox'
                disabled={$isSaving}
                onChange={() => toggleCompletedChanged({ ref: todoRef })}
                checked={completed}
              />
            )
          }
          <label onDoubleClick={() => $isSaving || todoDoubleClicked({ ref: todoRef })}>
            {title} {$isSaving && <small>(saving)</small>}
          </label>
          {
            $isSaving || (
              <button
                className='destroy'
                onClick={() => removeTodoClicked({ ref: todoRef })}
              />
            )
          }
        </div>
        {
          $isEditing &&
            <form onSubmit={(e) => {
              e.preventDefault()
              newTitleSubmitted({ ref: todoRef })
            }}>
              <input
                autoFocus
                className='edit'
                value={$newTitle || title}
                onBlur={() => newTitleAborted({ ref: todoRef })}
                onChange={(e) => newTitleChanged({ ref: todoRef, title: e.target.value })}
              />
            </form>
        }
      </li>
    )
  }
)
