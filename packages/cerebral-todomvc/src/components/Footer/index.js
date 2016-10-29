import React from 'react'
import {connect} from 'cerebral/react'
import counts from '../../computed/counts'
import cn from 'classnames'

export default connect({
  filter: 'app.filter',
  counts: counts
}, {
  filterClicked: 'app.filterClicked',
  clearCompletedClicked: 'app.clearCompletedClicked'
},
  function Footer ({ filter, counts, filterClicked, clearCompletedClicked }) {
    let countLabel = 'item left'
    if (counts.remainingCount === 0 || counts.remainingCount > 1) {
      countLabel = 'items left'
    }

    return (
      <footer className='footer'>
        <span className='todo-count'><strong>{counts.remainingCount} {countLabel}</strong></span>
        <ul className='filters'>
          <li>
            <a
              onClick={() => filterClicked({
                filter: 'all'
              })}
              className={cn({ selected: filter === 'all' })}
            >
              All
            </a>
          </li>
          <li>
            <a
              onClick={() => filterClicked({
                filter: 'active'
              })}
              className={cn({ selected: filter === 'active' })}
            >
              Active
            </a>
          </li>
          <li>
            <a
              onClick={() => filterClicked({
                filter: 'completed'
              })}
              className={cn({ selected: filter === 'completed' })}
            >
              Completed
            </a>
          </li>
        </ul>
        {
          counts.completedCount
            ? <button className='clear-completed' onClick={() => clearCompletedClicked()}>
              Clear completed ({counts.completedCount})
            </button>
          : null
        }
      </footer>
    )
  }
)
