import React from 'react'
import { connect } from '@cerebral/react'
import { state, signals } from 'cerebral/proxy'

function NewTodo({ get }) {
  const title = get(state.newTodoTitle)
  const titleChanged = get(signals.newTodoTitleChanged)
  const submitted = get(signals.newTodoSubmitted)

  return (
    <form
      id="todo-form"
      onSubmit={(e) => {
        e.preventDefault()
        submitted()
      }}
    >
      <input
        className="new-todo"
        autoComplete="off"
        placeholder="What needs to be done?"
        value={title || ''}
        onChange={(e) => titleChanged({ title: e.target.value })}
      />
    </form>
  )
}

export default connect(NewTodo)
