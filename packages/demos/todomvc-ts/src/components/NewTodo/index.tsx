import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral.proxy'

export default connect({
  title: state.newTodoTitle,
  titleChanged: signal.changeNewTodoTitle,
  submitted: signal.submitNewTodo,
})(function NewTodo({ title, titleChanged, submitted }) {
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
