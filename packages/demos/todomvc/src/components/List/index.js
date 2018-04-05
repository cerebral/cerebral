import React from 'react'
import Todo from '../Todo'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/proxy'
import computedIsAllChecked from '../../computed/isAllChecked'
import computedTodosUid from '../../computed/visibleTodosUids'

export default connect(
  {
    editingUid: state.editingUid,
    isAllChecked: computedIsAllChecked,
    todosUids: computedTodosUid,
    toggleAllChanged: signal.toggleAllChanged,
  },
  function List({ editingUid, isAllChecked, todosUids, toggleAllChanged }) {
    return (
      <section className="main">
        <input
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
