import './../node_modules/todomvc-common/base.css';
import './../node_modules/todomvc-app-css/index.css';
import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Controller from './../src/index.js';
import Model from 'cerebral-baobab';
import {Container} from 'cerebral-view-react';

import App from './modules/App/components/App';
import AppModule from './modules/App';

import Refs from './modules/Refs';
import Recorder from 'cerebral-module-recorder';
import Router from './modules/Router';

const controller = Controller(Model({}), {});

controller.modules({
  app: AppModule(),

  refs: Refs(),
  recorder: Recorder(),
  router: Router({
    '/': 'app.footer.allTodosClicked',
    '/:filter': 'app.footer.filterClicked'
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
