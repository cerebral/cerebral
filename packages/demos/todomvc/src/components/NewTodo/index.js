import React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral/proxy'

function NewTodo({ get }) {
  const title = get(state.newTodoTitle)
  const changeNewTodoTitle = get(sequences.changeNewTodoTitle)
  const submitNewTodo = get(sequences.submitNewTodo)

  return (
    <form
      id="todo-form"
      onSubmit={(e) => {
        e.preventDefault()
        submitNewTodo()
      }}
    >
      <input
        className="new-todo"
        autoComplete="off"
        placeholder="What needs to be done?"
        value={title || ''}
        onChange={(e) => changeNewTodoTitle({ title: e.target.value })}
      />
    </form>
  )
}

export default connect(NewTodo)
