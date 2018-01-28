import * as React from 'react';
import Todo from './Todo';
import { connect } from '../globals';

export default connect()
  .with(({ state, signals }) => ({
    editingUid: state.editingUid,
    isAllChecked: state.isAllChecked,
    todosUids: state.visibleTodosUids,
    toggleAllChanged: signals.toggleAllChanged
  }))
  .to(
    function List({ editingUid, isAllChecked, todosUids, toggleAllChanged }) {
      return (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            checked={isAllChecked}
            onChange={() => toggleAllChanged()}
          />
          <label htmlFor="toggle-all">
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todosUids.map((todoUid, index) => {
              const isEditing = todoUid === editingUid;
  
              return <Todo key={todoUid} uid={todoUid} isEditing={isEditing} />;
            })}
          </ul>
        </section>
      );
    }
  );
