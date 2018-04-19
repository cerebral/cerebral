import * as React from 'react'
import { connect } from '../fluent'
import Todo from './Todo'

export default connect()
  .with(({ state, signals }) => ({
    editingUid: state.editingUid,
    isAllChecked: state.isAllChecked.get(),
    todosUids: state.visibleTodosUids.get(),
    toggleAllChanged: signals.toggleAllChecked,
  }))
  .to(function List({ editingUid, isAllChecked, todosUids, toggleAllChanged }) {
    return (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={isAllChecked}
          onChange={() => toggleAllChanged()}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todosUids.map((todoUid, index) => {
            const isEditing = todoUid === editingUid

            return <Todo key={todoUid} uid={todoUid} isEditing={isEditing} />
          })}
        </ul>
      </section>
    )
  })
