import React from 'react/addons';

class TodosFooter extends React.Component {

  renderRemainingCount() {
    let count = this.props.state.remainingCount;
    if (count === 0 || count > 1) {
      return count + ' items left'; 
    } else {
      return count + ' item left';
    }   
  }

  renderRouteClass(route) {
    return this.props.state.activeRoute === route ? 'selected' : '';
  }

  clearCompleted() {
    actions.clearCompleted();
  }

  renderCompletedButton() {
    var state = this.props.state;
    return (
      <button id="clear-completed" onClick={this.clearCompleted}>
        Clear completed ({state.completedCount})
      </button>
    );
  }

  render() {
    var state = this.props.state;
    return (
      <footer id="footer">
        <span id="todo-count"><strong>{this.renderRemainingCount()}</strong></span>
        <ul id="filters">
          <li>
            <a className={this.renderRouteClass('/#/')} href="#/">All</a>
          </li>
          <li>
            <a className={this.renderRouteClass('/#/active')} href="#/active">Active</a>
          </li>
          <li>
            <a className={this.renderRouteClass('/#/completed')} href="#/completed">Completed</a>
          </li>
        </ul>
        {state.completedCount ? this.renderCompletedButton() : null}
      </footer>
    );
  }

}

export default TodosFooter;
