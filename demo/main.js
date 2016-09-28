import Inferno from 'inferno'
import {render} from 'inferno-dom'
import Demo from './components/Demo'

import {Controller} from 'cerebral'
import {Container} from 'cerebral/inferno'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral/router'
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
  <Container state={{title: 'hohoho'}}>
    <Demo />
  </Container>
), document.querySelector('#app'))
