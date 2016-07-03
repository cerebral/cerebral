import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'
import './styles.css'
import 'file?name=[name].[ext]!./index.html'

import React from 'react'
import ReactDOM from 'react-dom'
import Controller from 'cerebral'
import Model from 'cerebral-model-immutable'
// import Model from 'cerebral-model'
import { Container } from 'cerebral-view-react'

import App from './components/App'
import AppModule from './modules/App'

import Refs from './modules/Refs'
import Devtools from 'cerebral-module-devtools'
import Recorder from 'cerebral-module-recorder'
import Router from 'cerebral-module-router'

const controller = Controller(Model({}))

controller.addModules({
  app: AppModule(),
  refs: Refs(),
  recorder: Recorder(),
  devtools: Devtools(),
  router: Router({
    '/': 'app.footer.filterClicked'
  }, {
    onlyHash: true,
    mapper: { query: true }
  })
})

// RENDER
ReactDOM.render(
  <Container controller={controller}>
    <App foo='bar' />
  </Container>, document.querySelector('#app'))
