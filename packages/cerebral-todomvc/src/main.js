import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './styles.css';
import 'file?name=[name].[ext]!./index.html'

import React from 'react';
import ReactDOM from 'react-dom';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import {Container} from 'cerebral-view-react';

import App from './modules/App/components/App';
import AppModule from './modules/App';

import Refs from './modules/Refs';
import Devtools from 'cerebral-module-devtools';
import Recorder from 'cerebral-module-recorder';
import Router from 'cerebral-module-router';

const controller = Controller(Model({}));

controller.modules({
  app: AppModule(),

  refs: Refs(),
  recorder: Recorder(),
  devtools: Devtools(),
  router: Router({
    '/': 'app.footer.allTodosClicked',
    '/:filter': 'app.footer.filterClicked'
  }, {
    autoTrigger: true,
    onlyHash: true
  })
});

// RENDER
ReactDOM.render(
  <Container controller={controller}>
    <App/>
  </Container>, document.querySelector('#app'));
