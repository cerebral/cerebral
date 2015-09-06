import './../node_modules/todomvc-common/base.css';
import './../node_modules/todomvc-app-css/index.css';
import './styles.css';

import React from 'react';
import App from './App.js';
import controller from './controller.js';
import {Container} from 'cerebral-react';
import CerebralRouter from './../../cerebral-router/index.js';

// ACTIONS
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
import setUrl from './actions/setUrl.js';
import unsetFilter from './actions/unsetFilter.js';

// SIGNALS

controller.signal('allTodosClicked', unsetFilter, setVisibleTodos)
controller.signal('newTodoTitleChanged', setNewTodoTitle);
controller.signal('newTodoSubmitted',
  addTodo,
  setVisibleTodos,
  setAllChecked,
  setCounters,
  [
    saveTodo, {
      success: [updateTodo]
    }
  ]
);
controller.signal('removeTodoClicked', removeTodo, setVisibleTodos, setAllChecked, setCounters);
controller.signal('toggleCompletedChanged', toggleTodoCompleted, setVisibleTodos, setAllChecked, setCounters);
controller.signal('toggleAllChanged', toggleAllChecked, setVisibleTodos, setCounters);
controller.signal('filterClicked', setFilter, setVisibleTodos);
controller.signal('clearCompletedClicked', clearCompleted, setVisibleTodos, setAllChecked, setCounters);
controller.signal('todoDoubleClicked', editTodo);
controller.signal('newTitleChanged', setTodoNewTitle);
controller.signal('newTitleSubmitted', stopEditingTodo);

// ROUTER
CerebralRouter(controller, {
  '/': 'allTodosClicked',
  '/:filter': 'filterClicked'
}).start();

// RENDER
React.render(<Container controller={controller} app={App}/>, document.querySelector('#app'));



/*
const router = ReactiveRouter({
  '/': controller.signals.routeChanged,
  '/:filter': controller.signals.routeChanged
}, {
  hashbang: true
});

controller.on('change', function () {
  router.set(controller.get('url'));
});

controller.on('remember', function () {
  router.setSilent(controller.get('url'));
});
*/
