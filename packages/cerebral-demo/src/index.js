import React from 'react'
import {render} from 'react-dom'
import Demo from './components/Demo'

import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import {set} from 'cerebral/operators'

const AdminModule = {
  routes: {
    '/': 'routed'
  },
  signals: {
    routed: [set('state:title', 'Admin')]
  }
}

const controller = Controller({
  devtools: Devtools(),
  router: Router(),
  routes: {
    '/': 'routed'
  },
  state: {
    title: 'Hello world!'
  },
  signals: {
    routed: [set('state:title', 'Front page')]
  },
  modules: {
    admin: AdminModule
  }
})

render((
  <Container controller={controller} >
    <Demo />
  </Container>
), document.querySelector('#root'))
