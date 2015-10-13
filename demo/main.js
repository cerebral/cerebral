import './../node_modules/todomvc-common/base.css';
import './../node_modules/todomvc-app-css/index.css';
import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import controller from './controller.js';
import {Container} from 'cerebral-react';
import CerebralRouter from 'cerebral-router';

import allTodosClicked from './signals/allTodosClicked.js';
import newTodoTitleChanged from './signals/newTodoTitleChanged.js';
import newTodoSubmitted from './signals/newTodoSubmitted.js';
import removeTodoClicked from './signals/removeTodoClicked.js';
import toggleCompletedChanged from './signals/toggleCompletedChanged.js';
import toggleAllChanged from './signals/toggleAllChanged.js';
import filterClicked from './signals/filterClicked.js';
import clearCompletedClicked from './signals/clearCompletedClicked.js';
import todoDoubleClicked from './signals/todoDoubleClicked.js';
import newTitleChanged from './signals/newTitleChanged.js';
import newTitleSubmitted from './signals/newTitleSubmitted.js';
import recordClicked from './signals/recordClicked.js';
import playClicked from './signals/playClicked.js';
import stopClicked from './signals/stopClicked.js';

controller.signal('allTodosClicked', allTodosClicked);
controller.signal('newTodoTitleChanged', newTodoTitleChanged);
controller.signal('newTodoSubmitted', newTodoSubmitted);
controller.signal('removeTodoClicked', removeTodoClicked);
controller.signal('toggleCompletedChanged', toggleCompletedChanged);
controller.signal('toggleAllChanged', toggleAllChanged);
controller.signal('filterClicked', filterClicked);
controller.signal('clearCompletedClicked', clearCompletedClicked);
controller.signal('todoDoubleClicked', todoDoubleClicked);
controller.signal('newTitleChanged', newTitleChanged);
controller.signal('newTitleSubmitted', newTitleSubmitted);
controller.signal('recordClicked', recordClicked);
controller.signal('playClicked', playClicked);
controller.signal('stopClicked', stopClicked);

// ROUTER
const router = CerebralRouter(controller, {
  '/': 'allTodosClicked',
  '/:filter': 'filterClicked'
}, {
  baseUrl: '/todomvc'
}).trigger();

// RENDER
ReactDOM.render(
  <Container controller={controller}>
    <App/>
  </Container>, document.querySelector('#app'));
