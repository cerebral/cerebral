import React from 'react';
import classNames from 'classnames';
import {Decorator as Cerebral} from 'cerebral-view-react';

@Cerebral()
class Todo extends React.Component {
  edit() {

    if (this.props.todo.$isSaving) {
      return;
    }

    this.props.signals.app.list.todoDoubleClicked({
      ref: this.props.todo.$ref
    });

    // FOCUS fix
    setTimeout(() => {
      var input = this.refs.edit;
      input.focus();
      input.value = input.value;
    }, 0);

  }
  onNewTitleChange(event) {
    this.props.signals.app.list.newTitleChanged({
      ref: this.props.todo.$ref,
      title: event.target.value
    });
  }
  onNewTitleSubmit(event) {
    event.preventDefault();
    this.refs.edit.blur();
  }
  onCompletedToggle() {
    this.props.signals.app.list.toggleCompletedChanged({
      ref: this.props.todo.$ref
    });
  }
  onRemoveClick() {
    this.props.signals.app.list.removeTodoClicked({
      ref: this.props.todo.$ref
    });
  }
  onNewTitleBlur() {
    this.props.signals.app.list.newTitleSubmitted({
      ref: this.props.todo.$ref
    });
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
              onChange={() => this.onCompletedToggle()}
              checked={this.props.todo.completed}/>
          }
          <label onDoubleClick={() => this.edit()}>
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
              onClick={() => this.onRemoveClick()}/>
          }
        </div>
        <form onSubmit={(e) => this.onNewTitleSubmit(e)}>
          <input
            ref="edit"
            className="edit"
            value={this.props.todo.$newTitle || this.props.todo.title}
            onBlur={() => this.onNewTitleBlur()}
            onChange={(e) => this.onNewTitleChange(e)}
          />
        </form>
      </li>
    );

  }

}

export default Todo;
