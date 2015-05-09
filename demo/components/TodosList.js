import React from 'react/addons';
import Todo from './Todo.js';
import mixin from './../../src/mixin.js';

class TodosList extends React.Component {

  getCerebralState() {
    return [
      'isAllChecked',
      'visibleTodos'
    ];
  }

  renderTodo(todo, index) {
    var state = this.props.state;
    return <Todo key={index} index={index} todo={todo}/>
  }

  render() {
    
    return (
      <section id="main">
        <input 
          id="toggle-all" 
          type="checkbox" 
          checked={this.state.isAllChecked}
          onChange={this.signals.toggleAllChecked}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">
          {this.state.visibleTodos.map(this.renderTodo.bind(this))}
        </ul>
      </section>
    );
  }

}

export default mixin(TodosList);
