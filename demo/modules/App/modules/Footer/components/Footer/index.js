import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import counts from '../../computed/counts.js';

@Cerebral({
  filter: ['app', 'footer', 'filter'],
  counts: counts
})
class TodosFooter extends React.Component {
  renderRemainingCount() {
    let count = this.props.counts.remainingCount;
    if (count === 0 || count > 1) {
      return count + ' items left';
    } else {
      return count + ' item left';
    }
  }

  renderRouteClass(filter) {
    return this.props.filter === filter ? 'selected' : '';
  }

  renderCompletedButton() {
    return (
      <button id="clear-completed" onClick={() => this.props.signals.app.footer.clearCompletedClicked()}>
        Clear completed ({this.props.counts.completedCount})
      </button>
    );
  }

  render() {
    return (
      <footer id="footer">
        <span id="todo-count"><strong>{this.renderRemainingCount()}</strong></span>
        <ul id="filters">
          <li>
            <a className={this.renderRouteClass('all')} onClick={() => this.props.signals.app.footer.allTodosClicked()}>All</a>
          </li>
          <li>
            <a className={this.renderRouteClass('active')} onClick={() => this.props.signals.app.footer.filterClicked({filter: 'active'})}>Active</a>
          </li>
          <li>
            <a className={this.renderRouteClass('completed')} onClick={() => this.props.signals.app.footer.filterClicked({filter: 'completed'})}>Completed</a>
          </li>
        </ul>
        {this.props.counts.completedCount ? this.renderCompletedButton() : null}
      </footer>
    );
  }

}

export default TodosFooter;
