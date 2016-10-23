import React from 'react'
import classNames from 'classnames'
import { connect } from 'cerebral/react'

export default connect(props => ({
  todo: `app.todos.${props.todoRef}`
}), {
  todoDoubleClicked: 'app.todoDoubleClicked',
  newTitleChanged: 'app.todoNewTitleChanged',
  newTitleSubmitted: 'app.todoNewTitleSubmitted',
  toggleCompletedChanged: 'app.toggleTodoCompletedChanged',
  removeTodoClicked: 'app.removeTodoClicked',
  newTitleAborted: 'app.todoNewTitleAborted'
},
  class Todo extends React.Component {
    componentDidUpdate (prevProps) {
      if (!prevProps.todo.$isEditing && this.props.todo.$isEditing) {
        this.refs.edit.focus()
      }
    }
    edit () {
      if (this.props.todo.$isSaving) {
        return
      }

      this.props.todoDoubleClicked({
        ref: this.props.todoRef
      })
    }
    onNewTitleChange (event) {
      this.props.newTitleChanged({
        ref: this.props.todoRef,
        title: event.target.value
      })
    }
    onNewTitleSubmit (event) {
      event.preventDefault()
      this.props.newTitleSubmitted({
        ref: this.props.todoRef
      })
    }
    onCompletedToggle () {
      this.props.toggleCompletedChanged({
        ref: this.props.todoRef
      })
    }
    onRemoveClick () {
      this.props.removeTodoClicked({
        ref: this.props.todoRef
      })
    }
    onNewTitleBlur () {
      this.props.newTitleAborted({
        ref: this.props.todoRef
      })
    }
    render () {
      var className = classNames({
        completed: this.props.todo.completed,
        editing: this.props.todo.$isEditing
      })

      return (
        <li className={className}>
          <div className="view">
            {
              this.props.todo.$isSaving
              ? null
              : <input
                className="toggle"
                type="checkbox"
                disabled={this.props.todo.$isSaving}
                onChange={() => this.onCompletedToggle()}
                checked={this.props.todo.completed} />
            }
            <label onDoubleClick={() => this.edit()}>
              {this.props.todo.title} {this.props.todo.$isSaving
                ? <small>(saving)</small>
                : null
              }
            </label>
            {
              this.props.todo.$isSaving
              ? null
              : <button
                className="destroy"
                onClick={() => this.onRemoveClick()} />
            }
          </div>
          <form onSubmit={(e) => this.onNewTitleSubmit(e)}>
            <input
              ref="edit"
              className="edit"
              value={this.props.todo.$newTitle || this.props.todo.title}
              onBlur={() => this.onNewTitleBlur()}
              onChange={(e) => this.onNewTitleChange(e)}
            />
          </form>
        </li>
      )
    }
  }
)
