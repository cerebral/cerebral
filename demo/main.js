import React from 'react'
import {render} from 'react-dom'
import Demo from './components/Demo'

import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import {set, copy} from 'cerebral/operators'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: Devtools({timeTravel: true}),
  routes: {
    '/': 'routed'
  },
  state: {
    title: 'bar'
  },
  signals: {
    routed: [
      set('state:title', 'Page1')
    ]
  }
})

render((
  <Container controller={controller}>
    <Demo />
  </Container>
), document.querySelector('#app'))
