import React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/proxy'

export default connect(function NewTodo({ get }) {
  const title = get(state.newTodoTitle)
  const titleChanged = get(signal.newTodoTitleChanged)
  const submitted = get(signal.newTodoSubmitted)

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
})
