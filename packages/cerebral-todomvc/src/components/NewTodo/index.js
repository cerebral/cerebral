import React from 'react'
import { connect } from 'cerebral-view-react'

export default connect({
  title: 'app.new.title'
}, {
  titleChanged: 'app.new.titleChanged',
  submitted: 'app.new.submitted'
},
  function NewTodo ({ isSaving, title, titleChanged, submitted }) {
    return (
      <form id='todo-form' onSubmit={(e) => {
        e.preventDefault()
        submitted()
      }}>
        <input
          id='new-todo'
          autoComplete='off'
          placeholder='What needs to be done?'
          value={title}
          onChange={(e) => titleChanged({ title: e.target.value })}
        />
      </form>
    )
  }
)
