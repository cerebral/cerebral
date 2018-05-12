import React from 'react'
import Todo from '../Todo'
import { connect } from '@cerebral/react'
import { state, signal, computed } from 'cerebral/proxy'

export default connect(function List({ get }) {
  const editingUid = get(state.editingUid)
  const isAllChecked = get(computed.isAllChecked)
  const todosUids = get(computed.visibleTodosUids)
  const toggleAllChanged = get(signal.toggleAllChanged)

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
