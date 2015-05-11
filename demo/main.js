import './../node_modules/todomvc-common/base.css';
import './../node_modules/todomvc-app-css/index.css';
import React from 'react/addons';
import App from './App.js';
import cerebral from './cerebral.js';
import Page from 'page';
import addTodo from './signals/addTodo.js';
import removeTodo from './signals/removeTodo.js';
import toggleTodoCompleted from './signals/toggleTodoCompleted.js';
import setVisibleTodos from './signals/setVisibleTodos.js';
import setNewTodoTitle from './signals/setNewTodoTitle.js';
import setAllChecked from './signals/setAllChecked.js';
import setCounters from './signals/setCounters.js';
import toggleAllChecked from './signals/toggleAllChecked.js';
import saveTodo from './signals/saveTodo.js';
import updateTodo from './signals/updateTodo.js';

// SIGNALS

cerebral.signal('newTodoTitleChanged', setNewTodoTitle);
cerebral.signal('newTodoSubmitted', addTodo, saveTodo, updateTodo, setVisibleTodos, setAllChecked, setCounters);
cerebral.signal('removeTodo', removeTodo, setVisibleTodos, setAllChecked, setCounters);
cerebral.signal('toggleCompleted', toggleTodoCompleted, setVisibleTodos, setAllChecked, setCounters);
cerebral.signal('toggleAllChecked', toggleAllChecked, setVisibleTodos, setCounters);

// FACETS

cerebral.facet('visibleTodos', ['todos'], function (cerebral, ids) {
  return ids.map(function (index) {
    return cerebral.get('todos')[index];
  });
});

// RENDER

let Wrapper = cerebral.injectInto(App);

React.render(<Wrapper/>, document.querySelector('#app'));

// ROUTER

if (!location.hash) {
  location.hash = '#/';
}

global.cerebral = cerebral;
/*
Page('/', store.signals.setRoute);
Page('/active', store.signals.setRoute);
Page('/completed', store.signals.setRoute);
Page.start();
*/
