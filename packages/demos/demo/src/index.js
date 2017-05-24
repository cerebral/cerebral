import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {state} from 'cerebral/tags'
import {Container} from 'cerebral/react'
import FirebaseProvider from '@cerebral/firebase'
import firebaseConfig from './firebaseConfig'
import * as visibility from './helpers/visibility'
import FormsProvider from '@cerebral/forms'

// Modules
import Devtools from 'cerebral/devtools'
import Router from '@cerebral/router'
import app from './modules/app'
import clients from './modules/clients'
import projects from './modules/projects'
import tasks from './modules/tasks'
import user from './modules/user'

// Components
import App from './components/App'

const router = Router({
  routes: [
    {
      path: '/:view?',
      map: {
        view: state`app.$selectedView`
      }
    }
  ],
  onlyHash: true
})

const controller = Controller({
  devtools: Devtools({ remoteDebugger: 'localhost:8787' }),

  providers: [
    FirebaseProvider({config: firebaseConfig}),
    FormsProvider()
  ],

  modules: {
    app,
    clients,
    projects,
    router,
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
