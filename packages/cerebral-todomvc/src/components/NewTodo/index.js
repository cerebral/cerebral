import React from 'react'
import { connect } from 'cerebral-view-react'

export default connect({
  isSaving: 'app.new.isSaving',
  title: 'app.new.title'
}, class NewTodo extends React.Component {
  onFormSubmit (event) {
    event.preventDefault()
    this.props.signals.app.new.submitted()
  }

  onNewTodoTitleChange (event) {
    this.props.signals.app.new.titleChanged({
      title: event.target.value
    })
  }

  render () {
    return (
      <form id='todo-form' onSubmit={(e) => this.onFormSubmit(e)}>
        <input
          id='new-todo'
          autoComplete='off'
          placeholder='What needs to be done?'
          value={this.props.title}
          onChange={(e) => this.onNewTodoTitleChange(e)}
        />
      </form>
    )
  }
})
