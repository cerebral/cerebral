import Router from 'cerebral-router'
import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import App from './components/App'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import HttpProvider from 'cerebral-provider-http'
import app from './modules/app'
import home from './modules/home'
import repos from './modules/repos'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  router: Router({
    routes: {
      '/': 'home.routed',
      '/repos': 'repos.routed'
    },
    onlyHash: true
  }),
  modules: {app, home, repos},
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    })
  ]
})

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
