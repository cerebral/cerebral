import React from 'react';
import classNames from 'classnames';
import mixin from './../../src/mixin.js';

class Todo extends React.Component {

  toggleCompleted() {
    actions.toggleCompleted(this.props.todo);
  }

  edit() {

    if (this.props.todo.$isSaving) {
      return;
    }

    this.signals.todoDoubleClicked(this.props.todo);

    // FOCUS fix
    setTimeout(() => {
      var input = this.refs.edit.getDOMNode();
      input.focus();
      input.value = input.value;
    }, 0);   
  }

  onNewTitleChanged(event) {
    this.signals.newTitleChanged(this.props.todo, event.target.value);
  }

  saveEdit(event) {
    event.preventDefault();
    actions.saveEdit(this.props.todo, this.state.newTitle);
  }  

  onNewTitleSubmitted(event) {
    event.preventDefault();
    this.refs.edit.getDOMNode().blur();
  }

  render() {

    var className = classNames({
      completed: this.props.todo.completed,
      editing: this.props.todo.$isEditing
    });

    return (
      <li className={className}>
        <div className="view">
          {
            this.props.todo.$isSaving ? 
            null : 
            <input 
              className="toggle" 
              type="checkbox" 
              disabled={this.props.todo.$isSaving}
              onChange={this.signals.toggleCompletedChanged.bind(this, this.props.todo)}
              checked={this.props.todo.completed}/>
          }
          <label onDoubleClick={this.edit.bind(this)}>{this.props.todo.title}</label>
          {
            this.props.todo.$isSaving ? 
            null : 
            <button 
              className="destroy" 
              onClick={this.signals.removeTodoClicked.bind(this, this.props.todo)}/>
          }
        </div>
        <form onSubmit={this.onNewTitleSubmitted.bind(this)}>
          <input 
            ref="edit"
            className="edit" 
            value={this.props.todo.$newTitle || this.props.todo.title} 
            onBlur={this.signals.newTitleSubmitted.bind(null, this.props.todo)}
            onChange={this.onNewTitleChanged.bind(this)}
          />
        </form>
      </li>
    );

  }

}

export default mixin(Todo);
