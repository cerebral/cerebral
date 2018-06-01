import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'app.proxy'

export default connect(
  {
    title: state.newTodoTitle,
    changeNewTodoTitle: sequences.changeNewTodoTitle,
    submitNewTodo: sequences.submitNewTodo,
  },
  function NewTodo({ title, changeNewTodoTitle, submitNewTodo }) {
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
)
