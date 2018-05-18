import React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences, computed } from 'cerebral/proxy'
import classnames from 'classnames'

const filters = ['All', 'Active', 'Completed']

function Footer({ get }) {
  const filter = get(state.filter)
  const counts = get(computed.counts)
  const changeFilter = get(sequences.changeFilter)
  const clearCompletedTodos = get(sequences.clearCompletedTodos)

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
              onClick={() => changeFilter({ filter: filterName.toLowerCase() })}
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
          onClick={() => clearCompletedTodos()}
        >
          Clear completed ({counts.completed})
        </button>
      )}
    </footer>
  )
}

export default connect(Footer)
