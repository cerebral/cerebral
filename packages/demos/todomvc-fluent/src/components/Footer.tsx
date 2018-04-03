import * as React from 'react'
import { connect } from '../fluent'
import * as classnames from 'classnames'

const filters = ['All', 'Active', 'Completed']

export default connect()
  .with(({ state, signals }) => ({
    filter: state.filter,
    counts: state.counts.get(),
    filterClicked: signals.changeFilter,
    clearCompletedClicked: signals.clearCompletedTodos,
  }))
  .to(function Footer({
    filter,
    counts,
    filterClicked,
    clearCompletedClicked,
  }) {
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
