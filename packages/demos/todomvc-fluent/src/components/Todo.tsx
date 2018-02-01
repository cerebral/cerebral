import * as React from 'react';
import * as classnames from 'classnames';
import { connect } from '../globals';

export default connect<{ uid: string, isEditing: boolean }>()
  .with(({ state, props, signals }) => {
    const todo = state.todos.get(props.uid) || {
      title: '',
      editedTitle: '',
      completed: false
    };

    return {
      todo: {
        title: todo.title,
        completed: todo.completed,
        editedTitle: todo.editedTitle
      },
      todoDoubleClicked: signals.editTodo,
      newTitleChanged: signals.changeTodoTitle,
      newTitleSubmitted: signals.submitTodoTitle,
      toggleCompletedChanged: signals.toggleTodoCompleted,
      removeTodoClicked: signals.removeTodo,
      newTitleAborted: signals.abortEdit
    };
  })
  .to(
    function Todo({
      uid,
      isEditing,
      todo,
      todoDoubleClicked,
      newTitleChanged,
      newTitleSubmitted,
      toggleCompletedChanged,
      removeTodoClicked,
      newTitleAborted,
    }) {
      return (
        <li
          className={classnames({
            completed: todo.completed,
            editing: isEditing,
          })}
        >
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              onChange={() => toggleCompletedChanged({ uid })}
              checked={todo.completed}
            />
            <label onDoubleClick={() => todoDoubleClicked({ uid })}>
              {todo.title}
            </label>
            <button
              className="destroy"
              onClick={() => removeTodoClicked({ uid })}
            />
          </div>
          {isEditing &&
            <form
              onSubmit={e => {
                e.preventDefault();
                newTitleSubmitted({ uid });
              }}
            >
              <input
                autoFocus={true}
                className="edit"
                value={isEditing ? todo.editedTitle : todo.title}
                onBlur={() => newTitleSubmitted({ uid })}
                onChange={e => newTitleChanged({ uid, title: e.target.value })}
              />
            </form>}
        </li>
      );
    }
  );

/*
export default connect(
  {
    todo: state`todos.${props`uid`}`,
    todoDoubleClicked: signal`todoDoubleClicked`,
    newTitleChanged: signal`todoNewTitleChanged`,
    newTitleSubmitted: signal`todoNewTitleSubmitted`,
    toggleCompletedChanged: signal`toggleTodoCompletedChanged`,
    removeTodoClicked: signal`removeTodoClicked`,
    newTitleAborted: signal`todoNewTitleAborted`,
  },

)
*/