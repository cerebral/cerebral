import React from 'react'
import Todo from '../Todo'
import { connect } from 'cerebral/react'

import isAllChecked from '../../computed/isAllChecked'
import visibleTodosRefs from '../../computed/visibleTodosRefs'

export default connect({
  isAllChecked: isAllChecked(),
  todoRefs: visibleTodosRefs()
}, {
  toggleAllChanged: 'app.toggleAllChanged'
},
  function List ({ isAllChecked, todoRefs, toggleAllChanged }) {
    return (
      <section className='main'>
        <input
          className='toggle-all'
          type='checkbox'
          checked={isAllChecked}
          onChange={() => toggleAllChanged()} />
        <label htmlFor='toggle-all'>
          Mark all as complete
        </label>
        <ul className='todo-list'>
          {todoRefs.map(ref => <Todo key={ref} todoRef={ref} />)}
        </ul>
      </section>
    )
  }
)
