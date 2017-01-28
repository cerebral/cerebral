import React from 'react'
import Todo from '../Todo'
import { connect } from 'cerebral/react'
import {signal} from 'cerebral/tags'
import isAllChecked from '../../computed/isAllChecked'
import visibleTodosRefs from '../../computed/visibleTodosRefs'

export default connect({
  isAllChecked,
  visibleTodosRefs,
  toggleAllChanged: signal`app.toggleAllChanged`
},
  function List ({ isAllChecked, visibleTodosRefs, toggleAllChanged }) {
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
          {visibleTodosRefs.map(ref => <Todo key={ref} todoRef={ref} />)}
        </ul>
      </section>
    )
  }
)
