import React from 'react/addons';
import Todo from './Todo.js';
import Cerebral from './../../src/decorator.js';

@Cerebral(['isAllChecked', 'visibleTodos'])
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
          onChange={this.signals.toggleAllChanged}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">
          {this.props.visibleTodos.map(this.renderTodo.bind(this))}
        </ul>
      </section>
    );
  }

}

export default TodosList;
