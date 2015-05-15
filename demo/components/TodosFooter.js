import React from 'react/addons';
import mixin from './../../src/mixin.js';

class TodosFooter extends React.Component {

  getCerebralState() {
    return [
      'remainingCount',
      'completedCount',
      'filter'
    ];
  }

  renderRemainingCount() {
    let count = this.state.remainingCount;
    if (count === 0 || count > 1) {
      return count + ' items left';
    } else {
      return count + ' item left';
    }
  }

  renderRouteClass(filter) {
    return this.state.filter === filter ? 'selected' : '';
  }

  renderCompletedButton() {
    return (
      <button id="clear-completed" onClick={this.signals.clearCompletedClicked}>
        Clear completed ({this.state.completedCount})
      </button>
    );
  }

  render() {
    return (
      <footer id="footer">
        <span id="todo-count"><strong>{this.renderRemainingCount()}</strong></span>
        <ul id="filters">
          <li>
            <a className={this.renderRouteClass('all')} href="#/">All</a>
          </li>
          <li>
            <a className={this.renderRouteClass('active')} href="#/active">Active</a>
          </li>
          <li>
            <a className={this.renderRouteClass('completed')} href="#/completed">Completed</a>
          </li>
        </ul>
        {this.state.completedCount ? this.renderCompletedButton() : null}
      </footer>
    );
  }

}

export default mixin(TodosFooter);
