import React from 'react'
import Todo from '../Todo'
import { connect } from 'cerebral-view-react'

import isAllChecked from '../../computed/isAllChecked.js'
import visibleTodosKeys from '../../computed/visibleTodosKeys.js'

export default connect({
  isAllChecked: isAllChecked(),
  todoKeys: visibleTodosKeys()
}, {
  toggleAllChanged: 'app.list.toggleAllChanged'
},
  function List({ isAllChecked, todoKeys, toggleAllChanged }) {
    return (
      <section id='main'>
        <input
          id='toggle-all'
          type='checkbox'
          checked={isAllChecked}
          onChange={() => toggleAllChanged()} />
        <label htmlFor='toggle-all'>
          Mark all as complete
        </label>
        <ul id='todo-list'>
          {todoKeys.map(key => <Todo key={key} todoKey={key} />)}
        </ul>
      </section>
    )
  }
)
