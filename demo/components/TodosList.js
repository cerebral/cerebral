import React from 'react';
import Todo from './Todo.js';
import {Decorator as Cerebral} from 'cerebral-react';

import isAllChecked from '../computed/isAllChecked.js';
import visibleTodos from '../computed/visibleTodos.js';

@Cerebral({
  isAllChecked: isAllChecked,
  todos: visibleTodos
})
class TodosList extends React.Component {
  renderTodo(todo, index) {
    return <Todo key={index} index={index} todo={todo}/>
  }

  render() {
    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          checked={this.props.isAllChecked}
          onChange={() => this.props.signals.toggleAllChanged()}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">
          {this.props.todos.map(this.renderTodo.bind(this))}
        </ul>
      </section>
    );
  }

}

export default TodosList;
