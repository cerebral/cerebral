import React from 'react';
import Todo from './Todo.js';
import StateComponent from './../StateComponent.js';

class TodosList extends StateComponent {
  getStatePaths() {
    return {
      todos: ['visibleTodos'],
      isAllChecked: ['isAllChecked'],
      tod: ['todos']
    };
  }
  renderTodo(todo, index) {
    return <Todo key={index} index={index} todo={todo}/>
  }

  render() {
    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          checked={this.state.isAllChecked}
          onChange={this.signals.toggleAllChanged}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">
          {this.state.todos.map(this.renderTodo.bind(this))}
        </ul>
      </section>
    );
  }

}

export default TodosList;
