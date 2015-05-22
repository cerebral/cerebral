import './../node_modules/todomvc-common/base.css';
import './../node_modules/todomvc-app-css/index.css';
import React from 'react/addons';
import App from './App.js';
import Table from './components/Table.js';
import cerebral from './cerebral.js';
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

cerebral.signal('newTodoTitleChanged', setNewTodoTitle);
cerebral.signal('newTodoSubmitted', addTodo, setVisibleTodos, setAllChecked, setCounters, saveTodo, updateTodo);
cerebral.signal('removeTodoClicked', removeTodo, setVisibleTodos, setAllChecked, setCounters);
cerebral.signal('toggleCompletedChanged', toggleTodoCompleted, setVisibleTodos, setAllChecked, setCounters);
cerebral.signal('toggleAllChanged', toggleAllChecked, setVisibleTodos, setCounters);
cerebral.signal('routeChanged', setFilter, setVisibleTodos);
cerebral.signal('clearCompletedClicked', clearCompleted, setVisibleTodos, setAllChecked, setCounters);
cerebral.signal('todoDoubleClicked', editTodo);
cerebral.signal('newTitleChanged', setTodoNewTitle);
cerebral.signal('newTitleSubmitted', stopEditingTodo);

// RENDER

let Wrapper = cerebral.injectInto(Table);

React.render(<Wrapper/>, document.querySelector('#app'));

// ROUTER

console.log('location.pathname', location.pathname.substr(0, location.pathname.length - 1));
Page.base(location.pathname.substr(0, location.pathname.length - 1));

Page('/', cerebral.signals.routeChanged);
Page('/active', cerebral.signals.routeChanged);
Page('/completed', cerebral.signals.routeChanged);

Page.start();

