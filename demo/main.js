import './../node_modules/todomvc-common/base.css';
import './../node_modules/todomvc-app-css/index.css';
import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import Controller from './../src/index.js';
import Model from 'cerebral-baobab';
import {Container} from 'cerebral-react';

import NewTodo from './modules/NewTodo';
import List from './modules/List';
import Footer from './modules/Footer';

import Refs from './modules/Refs';
import Recorder from './modules/Recorder';
import Router from './modules/Router';

const controller = Controller(Model({}));

controller.registerModules({
  new: NewTodo(),
  list: List(),
  footer: Footer(),

  refs: Refs(),
  recorder: Recorder(),
  router: Router({
    '/': 'footer.allTodosClicked',
    '/:filter': 'footer.filterClicked'
  }, {
    onlyHash: true,
    baseUrl: '/todomvc/'
  })
});

// RENDER
ReactDOM.render(
  <Container controller={controller}>
    <App/>
  </Container>, document.querySelector('#app'));
