import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import counts from '../../computed/counts'
import cn from 'classnames'

export default connect({
  filter: state`app.filter`,
  counts,
  filterClicked: signal`app.filterClicked`,
  clearCompletedClicked: signal`app.clearCompletedClicked`
},
  ({ filter, counts, filterClicked, clearCompletedClicked }) => ({
    filter,
    remainingCount: counts.remaining,
    completedCount: counts.completed,
    countLabel: (counts.remaining === 0 || counts.remaining > 1) ? 'items left' : 'item left',
    filterClicked,
    clearCompletedClicked
  }),
  function Footer ({ filter, remainingCount, completedCount, countLabel, filterClicked, clearCompletedClicked }) {
    return (
      <footer className='footer'>
        <span className='todo-count'><strong>{remainingCount} {countLabel}</strong></span>
        <ul className='filters'>
          {['All', 'Active', 'Completed'].map(filterName => (
            <li key={filterName}>
              <a
                onClick={() => filterClicked({ filter: filterName.toLowerCase() })}
                className={cn({ selected: filter === filterName.toLowerCase() })}
              >
                {filterName}
              </a>
            </li>
          ))}
        </ul>
        {
          !!completedCount && (
            <button className='clear-completed' onClick={() => clearCompletedClicked()}>
              Clear completed ({completedCount})
            </button>
          )
        }
      </footer>
    )
  }
)
