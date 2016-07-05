import React from 'react'
import { connect, Link } from 'cerebral-view-react'
import counts from '../../computed/counts.js'

export default connect({
  filter: 'app.footer.filter',
  counts: counts
}, class TodosFooter extends React.Component {
  renderRemainingCount () {
    let count = this.props.counts.remainingCount
    if (count === 0 || count > 1) {
      return count + ' items left'
    } else {
      return count + ' item left'
    }
  }

  renderRouteClass (filter) {
    return this.props.filter === filter ? 'selected' : ''
  }

  renderCompletedButton () {
    return (
      <button id='clear-completed' onClick={() => this.props.signals.app.footer.clearCompletedClicked()}>
        Clear completed ({this.props.counts.completedCount})
      </button>
    )
  }

  render () {
    return (
      <footer id='footer'>
        <span id='todo-count'><strong>{this.renderRemainingCount()}</strong></span>
        <ul id='filters'>
          <li>
            <Link className={this.renderRouteClass('all')} signal='app.footer.filterClicked'>All</Link>
          </li>
          <li>
            <Link className={this.renderRouteClass('active')} signal='app.footer.filterClicked' params={{filter: 'active'}}>Active</Link>
          </li>
          <li>
            <Link className={this.renderRouteClass('completed')} signal='app.footer.filterClicked' params={{filter: 'completed'}}>Completed</Link>
          </li>
        </ul>
        {this.props.counts.completedCount ? this.renderCompletedButton() : null}
      </footer>
    )
  }

})
