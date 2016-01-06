import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
  isSaving: ['new', 'isSaving'],
  title: ['new', 'title']
})
class NewTodo extends React.Component {
  onFormSubmit(event) {
    event.preventDefault();
    this.props.signals.new.submitted();
  }

  onNewTodoTitleChange(event) {
    this.props.signals.new.titleChanged({
      title: event.target.value
    });
  }

  render() {
    return (
      <form id="todo-form" onSubmit={(e) => this.onFormSubmit(e)}>
        <input
          id="new-todo"
          autoComplete="off"
          placeholder="What needs to be done?"
          disabled={this.props.isSaving}
          value={this.props.title}
          onChange={(e) => this.onNewTodoTitleChange(e)}
        />
      </form>
    );
  }

}

export default NewTodo;
