import React from 'react'
import Todo from '../Todo'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

function List({ get }) {
  const editingUid = get(state.editingUid)
  const isAllChecked = get(state.isAllChecked)
  const uids = get(state.uids)
  const toggleAllChecked = get(sequences.toggleAllChecked)

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
        {uids.map((todoUid, index) => {
          const isEditing = todoUid === editingUid

          return <Todo key={todoUid} uid={todoUid} isEditing={isEditing} />
        })}
      </ul>
    </section>
  )
}

export default connect(List)
