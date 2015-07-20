import React from 'react';
import classNames from 'classnames';
import StateComponent from './../StateComponent.js';

class Todo extends StateComponent {

  edit() {

    if (this.props.todo.$isSaving) {
      return;
    }

    this.signals.todoDoubleClicked({
      ref: this.props.todo.$ref
    });

    // FOCUS fix
    setTimeout(() => {
      var input = this.refs.edit.getDOMNode();
      input.focus();
      input.value = input.value;
    }, 0);
  }

  onNewTitleChanged(event) {
    this.signals.newTitleChanged({
      ref: this.props.todo.$ref,
      title: event.target.value
    });
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
              onChange={this.signals.toggleCompletedChanged.bind(null, {ref: this.props.todo.$ref})}
              checked={this.props.todo.completed}/>
          }
          <label onDoubleClick={this.edit.bind(this)}>
            {this.props.todo.title} {this.props.todo.$isSaving ?
              <small>(saving)</small> :
              null
            }
          </label>
          {
            this.props.todo.$isSaving ?
            null :
            <button
              className="destroy"
              onClick={this.signals.removeTodoClicked.bind(null, {
                ref: this.props.todo.$ref
              })}/>
          }
        </div>
        <form onSubmit={this.onNewTitleSubmitted.bind(this)}>
          <input
            ref="edit"
            className="edit"
            value={this.props.todo.$newTitle || this.props.todo.title}
            onBlur={this.signals.newTitleSubmitted.bind(null, {
              ref: this.props.todo.$ref
            })}
            onChange={this.onNewTitleChanged.bind(this)}
          />
        </form>
      </li>
    );

  }

}

export default Todo;
