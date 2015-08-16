import React from 'react/addons';
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral((props) => {
  console.log(props);
  return {
    remainingCount: ['remainingCount'],
    filter: ['filter'],
    completedCount: ['completedCount']
  }
})
class TodosFooter extends React.Component {
  renderRemainingCount() {
    let count = this.props.remainingCount;
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
      <button id="clear-completed" onClick={() => this.props.signals.clearCompletedClicked()}>
        Clear completed ({this.props.completedCount})
      </button>
    );
  }

  render() {
    return (
      <footer id="footer">
        <span id="todo-count"><strong>{this.renderRemainingCount()}</strong></span>
        <ul id="filters">
          <li>
            <a className={this.renderRouteClass('all')} href="/">All</a>
          </li>
          <li>
            <a className={this.renderRouteClass('active')} href="/active">Active</a>
          </li>
          <li>
            <a className={this.renderRouteClass('completed')} href="/completed">Completed</a>
          </li>
        </ul>
        {this.props.completedCount ? this.renderCompletedButton() : null}
      </footer>
    );
  }

}

export default TodosFooter;
