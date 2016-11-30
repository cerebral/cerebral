import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import FirebaseProvider from 'cerebral-provider-firebase'
import firebaseConfig from './firebaseConfig'
import * as visibility from './helpers/visibility'

// Modules
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import app from './modules/app'
import clients from './modules/clients'
import projects from './modules/projects'
import tasks from './modules/tasks'
import user from './modules/user'

// Components
import App from './components/App'

const controller = Controller({
  options: {strictRender: true},
  devtools: Devtools({
    // remoteDebugger: 'localhost:8585'
  }),
  router: Router({
    routes: {
      '/': 'app.routed',
      '/clients': 'clients.routed',
      '/projects': 'projects.routed',
      '/tasks': 'tasks.routed'
    },
    onlyHash: true
  }),

  providers: [
    FirebaseProvider({config: firebaseConfig})
  ],

  modules: {
    app,
    clients,
    projects,
    tasks,
    user
  }
})

controller.getSignal('app.bootstrap')({})
visibility.register(controller.getSignal('tasks.visibilityChanged'))

render((
  <Container controller={controller} >
    <App />
  </Container>
), document.querySelector('#root'))

// Visibility API
