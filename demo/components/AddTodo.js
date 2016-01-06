import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
  isSaving: ['isSaving'],
  newTodoTitle: ['newTodoTitle']
})
class AddTodo extends React.Component {
  onFormSubmit(event) {
    event.preventDefault();
    this.props.signals.newTodoSubmitted();
  }

  onNewTodoTitleChange(event) {
    this.props.signals.newTodoTitleChanged.sync({
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
          value={this.props.newTodoTitle}
          onChange={(e) => this.onNewTodoTitleChange(e)}
        />
      </form>
    );
  }

}

export default AddTodo;
