import * as React from 'react'
import Todo from '../Todo'
import { connect } from '@cerebral/react'
import { state, sequences, computed } from 'cerebral.proxy'

export default connect(
  {
    editingUid: state.editingUid,
    isAllChecked: computed.isAllChecked,
    todosUids: computed.visibleTodosUids,
    toggleAllChecked: sequences.toggleAllChecked,
  },
  function List({ editingUid, isAllChecked, todosUids, toggleAllChecked }) {
    return (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={isAllChecked}
          onChange={() => toggleAllChecked()}
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
