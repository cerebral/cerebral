import React from 'react';
import State from './../../src/decorator.js';

class AddTodo extends React.Component {
  addTodo(event) {
    event.preventDefault();
    this.signals.newTodoSubmitted();
  }

  setNewTodoTitle(event) {
    this.signals.newTodoTitleChanged(event.target.value);
  }

  render() {
    return (
      <form id="todo-form" onSubmit={this.addTodo.bind(this)}>
        <input 
          id="new-todo" 
          autoComplete="off"
          placeholder="What needs to be done?" 
          disabled={this.props.isSaving}
          value={this.props.newTodoTitle}
          onChange={this.setNewTodoTitle.bind(this)}
        />
      </form>
    );
  }

}

export default State(AddTodo, ['isSaving', 'newTodoTitle']);
