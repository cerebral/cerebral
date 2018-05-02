import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, signal, computed } from 'cerebral.proxy'
import classnames from 'classnames'

const filters = ['All', 'Active', 'Completed']

export default connect({
  filter: state.filter,
  counts: computed.counts,
  filterClicked: signal.filterClicked,
  clearCompletedClicked: signal.clearCompletedClicked,
})(function Footer({ filter, counts, filterClicked, clearCompletedClicked }) {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>
          {counts.remaining} {counts.remaining === 1 ? 'item' : 'items'} left
        </strong>
      </span>
      <ul className="filters">
        {filters.map((filterName) => (
          <li key={filterName}>
            <a
              onClick={() =>
                filterClicked({ filter: filterName.toLowerCase() })
              }
              className={classnames({
                selected: filter === filterName.toLowerCase(),
              })}
            >
              {filterName}
            </a>
          </li>
        ))}
      </ul>
      {!!counts.completed && (
        <button
          className="clear-completed"
          onClick={() => clearCompletedClicked()}
        >
          Clear completed ({counts.completed})
        </button>
      )}
    </footer>
  )
})
