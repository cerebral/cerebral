import React from 'react'
import Todo from '../Todo'
import { connect } from 'cerebral-view-react'

import isAllChecked from '../../computed/isAllChecked.js'
import visibleTodosRefs from '../../computed/visibleTodosRefs.js'

export default connect({
  isAllChecked: isAllChecked(),
  todoRefs: visibleTodosRefs()
}, {
  toggleAllChanged: 'app.toggleAllChanged'
},
  function List({ isAllChecked, todoRefs, toggleAllChanged }) {
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
          {todoRefs.map(ref => <Todo key={ref} todoRef={ref} />)}
        </ul>
      </section>
    )
  }
)
