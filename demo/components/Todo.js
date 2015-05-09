import React from 'react';
import classNames from 'classnames';
import mixin from './../../src/mixin.js';

class Todo extends React.Component {

  toggleCompleted() {
    actions.toggleCompleted(this.props.todo);
  }

  edit() {
     actions.editTodo(this.props.todo);

    // FOCUS fix
    setTimeout(() => {
      var input = this.refs.edit.getDOMNode();
      input.focus();
      input.value = input.value;
    }, 0);   
  }

  changeNewTitle(event) {
    this.setState({
      newTitle: event.target.value
    });
  }

  saveEdit(event) {
    event.preventDefault();
    actions.saveEdit(this.props.todo, this.state.newTitle);
  }  

  render() {

    var className = classNames({
      completed: this.props.todo.completed,
      editing: this.props.isEditing
    });

    return (
      <li className={className}>
        <div className="view">
          <input 
            className="toggle" 
            type="checkbox" 
            onChange={this.signals.toggleCompleted.bind(this, this.props.todo)}
            checked={this.props.todo.completed}/>
          <label onDoubleClick={this.edit.bind(this)}>{this.props.todo.title}</label>
          <button className="destroy" onClick={this.signals.removeTodo.bind(this, this.props.todo)}></button>
        </div>
        <form onSubmit={this.saveEdit.bind(this)}>
          <input 
            ref="edit"
            className="edit" 
            value={''} 
            onBlur={this.saveEdit.bind(this)}
            onChange={this.changeNewTitle.bind(this)}
          />
        </form>
      </li>
    );

  }

}

export default mixin(Todo);
