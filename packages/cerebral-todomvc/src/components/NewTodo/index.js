import React from 'react'
import { connect } from 'cerebral-view-react'

export default connect({
  title: 'app.new.title'
}, function NewTodo ({ isSaving, title, signals }) {
  return (
    <form id='todo-form' onSubmit={(e) => {
      e.preventDefault()
      signals.app.new.submitted()
    }}>
      <input
        id='new-todo'
        autoComplete='off'
        placeholder='What needs to be done?'
        value={title}
        onChange={(e) => signals.app.new.titleChanged({ title: e.target.value })}
      />
    </form>
  )
})
