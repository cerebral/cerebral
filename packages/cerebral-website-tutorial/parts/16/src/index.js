import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import HttpProvider from 'cerebral-provider-http'
import { ContextProvider } from 'cerebral/providers'
import logger from 'js-logger'
import Router from 'cerebral-router'
import AppModule from './modules/app'
import StateAndActionModule from './modules/stateandaction'
import GitHubModule from './modules/github'

logger.useDefaults()

const controller = Controller(
  {
    modules: {
      app: AppModule,
      sas: StateAndActionModule,
      github: GitHubModule
    },

    devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
    providers: [
      HttpProvider({
        baseUrl: 'https://api.github.com'
      }),
      ContextProvider({
        logger})
    ],
    router: Router({
      routes: {
        '/': 'app.stateAndActionsRouted',
        '/github': 'app.gitHubRouted',
        '/*': 'app.unknownRouted'
      },
      onlyHash: true // Use hash urls
    })

  })

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))
