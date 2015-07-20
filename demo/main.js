import './../node_modules/todomvc-common/base.css';
import './../node_modules/todomvc-app-css/index.css';
import './styles.css';

import React from 'react';
import App from './App.js';
import controller from './controller.js';
import Page from 'page';
import addTodo from './actions/addTodo.js';
import removeTodo from './actions/removeTodo.js';
import toggleTodoCompleted from './actions/toggleTodoCompleted.js';
import setVisibleTodos from './actions/setVisibleTodos.js';
import setNewTodoTitle from './actions/setNewTodoTitle.js';
import setAllChecked from './actions/setAllChecked.js';
import setCounters from './actions/setCounters.js';
import toggleAllChecked from './actions/toggleAllChecked.js';
import saveTodo from './actions/saveTodo.js';
import updateTodo from './actions/updateTodo.js';
import setFilter from './actions/setFilter.js';
import clearCompleted from './actions/clearCompleted.js';
import editTodo from './actions/editTodo.js';
import setTodoNewTitle from './actions/setTodoNewTitle.js';
import stopEditingTodo from './actions/stopEditingTodo.js';

// SIGNALS

controller.signal('newTodoTitleChanged', setNewTodoTitle);
controller.signal('newTodoSubmitted', addTodo, setVisibleTodos, setAllChecked, setCounters, [saveTodo], updateTodo);
controller.signal('removeTodoClicked', removeTodo, setVisibleTodos, setAllChecked, setCounters);
controller.signal('toggleCompletedChanged', toggleTodoCompleted, setVisibleTodos, setAllChecked, setCounters);
controller.signal('toggleAllChanged', toggleAllChecked, setVisibleTodos, setCounters);
controller.signal('routeChanged', setFilter, setVisibleTodos);
controller.signal('clearCompletedClicked', clearCompleted, setVisibleTodos, setAllChecked, setCounters);
controller.signal('todoDoubleClicked', editTodo);
controller.signal('newTitleChanged', setTodoNewTitle);
controller.signal('newTitleSubmitted', stopEditingTodo);

// RENDER
const Wrapper = React.createClass({
  childContextTypes: {
    controller: React.PropTypes.object
  },
  getChildContext() {
    return {
      controller: controller
    }
  },
  render() {
    return <App/>;
  }
});
React.render(<Wrapper/>, document.querySelector('#app'));

// ROUTER
Page.base(location.pathname.substr(0, location.pathname.length - 1));

Page('/', controller.signals.routeChanged);
Page('/active', controller.signals.routeChanged);
Page('/completed', controller.signals.routeChanged);

Page.start();
