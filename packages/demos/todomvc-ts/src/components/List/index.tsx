import * as React from 'react'
import Todo from '../Todo'
import { connect } from '@cerebral/react'
import { state, signals, computed } from 'cerebral.proxy'

export default connect(
  {
    editingUid: state.editingUid,
    isAllChecked: computed.isAllChecked,
    todosUids: computed.visibleTodosUids,
    toggleAllChanged: signals.toggleAllChecked,
  },
  function List({ editingUid, isAllChecked, todosUids, toggleAllChanged }) {
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
  }
)
