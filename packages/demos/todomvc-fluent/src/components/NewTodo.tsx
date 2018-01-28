import * as React from 'react';
import { connect } from '../globals';

export default connect()
  .with(({ state, signals }) => {
    return {
      title: state.newTodoTitle,
      titleChanged: signals.newTodoTitleChanged,
      submitted: signals.newTodoSubmitted
    };
  })
  .to(
    function NewTodo({ title, titleChanged, submitted }) {
      return (
        <form
          id="todo-form"
          onSubmit={e => {
            e.preventDefault();
            submitted();
          }}
        >
          <input
            className="new-todo"
            autoComplete="off"
            placeholder="What needs to be done?"
            value={title || ''}
            onChange={e => titleChanged({ title: e.target.value })}
          />
        </form>
      );
    }
  );
