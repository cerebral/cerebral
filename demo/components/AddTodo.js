import React from 'react';
import StateComponent from './../StateComponent.js';

class AddTodo extends StateComponent {
  getStatePaths() {
    return {
      isSaving: ['isSaving'],
      newTodoTitle: ['newTodoTitle']
    };
  }
  addTodo(event) {
    event.preventDefault();
    this.signals.newTodoSubmitted();
  }

  setNewTodoTitle(event) {
    this.signals.newTodoTitleChanged({
      title: event.target.value
    });
  }

  render() {
    return (
      <form id="todo-form" onSubmit={this.addTodo.bind(this)}>
        <input
          id="new-todo"
          autoComplete="off"
          placeholder="What needs to be done?"
          disabled={this.state.isSaving}
          value={this.state.newTodoTitle}
          onChange={this.setNewTodoTitle.bind(this)}
        />
      </form>
    );
  }

}

export default AddTodo;
